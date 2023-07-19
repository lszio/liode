import * as path from "path";
import * as fs from "fs";
import * as ini from "ini";
import { program, Command } from "commander";
import { execSync } from "child_process";
import { checkbox, confirm } from "@inquirer/prompts";

function parse(file: string) {
  const parent = path.dirname(file);
  const config = ini.parse(fs.readFileSync(file).toString());
  return Object.keys(config)
    .filter(k => k.startsWith("submodule"))
    .map(k => config[k])
    .map(m => {
      const p = path.resolve(parent, m.path);
      const use = inUse(p);
      return {
        path: p,
        root: parent,
        use,
        dirty: use && isDirty(p),
        name: m.path,
        url: m.url
      };
    });
}

function findGitSubmodules(p: string) {
  const file = path.resolve(p, ".gitmodules");
  const parent = path.dirname(p);

  if (fs.existsSync(file)) {
    return parse(file);
  } else if (parent === p) {
    return [];
  } else {
    return findGitSubmodules(parent);
  }
}

function isDirty(path: string) {
  try {
    execSync("git diff --quiet", { cwd: path });
    return true;
  } catch (error) {
    return false;
  }
}

function inUse(p: string): boolean {
  return fs.readdirSync(p).length !== 0;
}

async function selectToUse(p: string = path.resolve(".")): Promise<string[]> {
  const modules = findGitSubmodules(p);

  const answer = await checkbox({
    message: "Select modules to use\n",
    choices: modules.map(m => ({
      ...m,
      checked: m.use,
      value: m.path,
      name: `${m.name}${m.dirty ? " : DIRTY" : ""}`
    })),
    pageSize: modules.length
  });

  return answer;
}

interface Option {
  path?: string;
  yes?: boolean;
  strict?: boolean;
}

async function useModules(selects: string[], option: Option) {
  const modules = findGitSubmodules(path.resolve(option.path || "."));

  const [toUse, toDisuse] = [[], []];
  for (const module of modules) {
    if (selects.some((p: string | RegExp) => p instanceof RegExp ? module.name.match(p) : p === module.path)) {
      toUse.push(module);
    } else if (option.strict && module.use) {
      toDisuse.push(module);
    }
  }

  for (const module of toUse) {

    if (!module.use) {
      execSync(`git submodule update --init ${path.relative(module.root, module.path)}`, { cwd: module.root });
    } else {
      console.log(`module ${module.name} already in use`);
    }
  }

  for (const module of toDisuse) {
    if (!module.dirty || (option.yes || await confirm({
      message: `dirty submodule ${module.name}, remove?[Y/n]`,
      default: true
    }))) {
      execSync(`git submodule deinit -f ${path.relative(module.root, module.path)}`, { cwd: module.root });
    } else {
      console.log(`cancel deinit ${module.name}`);
    }
  }
}

async function useAction(selected: string[], option: Option) {
  if (selected.length === 0) {
    selected = await selectToUse(option.path);
  }
  useModules(selected, option);
}

async function disuseAction(selected: string[], option: Option) {
  if (selected.length === 0) {
    const modules = findGitSubmodules(option.path);
    const toUse = modules.filter(m => !selected.some((p: string | RegExp) => p instanceof RegExp ? m.name.match(p) : m.path.endsWith(p))).map(m => m.path);
    useModules(toUse, { ...option, strict: true });
  }
}

function listAction(p: string, option: Option) {
  console.log(findGitSubmodules(p || path.resolve(".")));
}

program.name("gsm")
  .version("0.0.0")
  .addCommand(
    new Command()
      .name("list")
      .argument("<path>")
      .action(listAction)
  )
  .addCommand(
    new Command()
      .name("use")
      .argument("[modules...]")
      .option("-p, --path [path]", "path", ".")
      .option("-y, --yes [yes]", "yes", false)
      .option("-s, --strict [strict]", "strict", false)
      .action(useAction)
  )
  .addCommand(
    new Command()
      .name("disuse")
      .argument("[modules...]")
      .option("-p, --path [path]", "path", ".")
      .option("-y, --yes [yes]", "yes", false)
      .action(disuseAction)
  )
  .parse(process.argv);
