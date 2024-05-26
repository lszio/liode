import { Args, Command, Options } from "@effect/cli"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Array, ConfigProvider, Console, Effect, Option } from "effect"


const configs = Options.keyValueMap("c").pipe(Options.optional)

const broxy = Command.make("broxy", { configs }, ({ configs }) =>
    Option.match(configs, {
        onNone: () => Console.log("Running Broxy"),
        onSome: (configs) => {
            const pairs = Array.fromIterable(configs)
                .map(([key, value]) => `${key}=> ${value}`)
                .join(", ")
            return Console.log(pairs);
        }
    })
)

const scan = Command.make("scan",)

const command = broxy.pipe(Command.withSubcommands([scan]));

const cli = Command.run(command, {
    name: "Broxy",
    version: "0.0.0"
})

Effect.suspend(() => cli(process.argv)).pipe(
    Effect.withConfigProvider(ConfigProvider.nested(ConfigProvider.fromEnv(), "GIT")),
    Effect.provide(BunContext.layer),
    BunRuntime.runMain
)
