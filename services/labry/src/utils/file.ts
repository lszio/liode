import { Effect } from "effect";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { dirname } from "path";
import * as YAML from "yaml";
import { curry } from "@ferld/likit";

const getFileType = (path: string | URL): string | undefined => {
  if (typeof path === "string") {
    return path.split(".").pop();
  } else {
    return getFileType(path.pathname);
  }
};

export const readFileObject = (path: string | URL) =>
  Effect.runSync(
    Effect.orElseSucceed(
      Effect.try(() => {
        const content = readFileSync(path, { encoding: "utf-8" });

        switch (getFileType(path)) {
          case "yaml":
          case "yml":
            return YAML.parse(content);
          case "json":
            return JSON.parse(content);
        }
      }),
      () => undefined
    )
  );

export const writeFileObject = curry(
  (value: object | string, path: string | URL) =>
    Effect.runSync(
      Effect.orElseSucceed(
        Effect.try(() => {
          const type = getFileType(path);
          let content = "";

          if (typeof value === "string") {
            content = value;
          } else {
            switch (type) {
              case "yml":
              case "yaml":
                content = YAML.stringify(value);
                break;
              case "json":
                content = JSON.stringify(value);
                break;
            }
          }

          const parent =
            typeof path === "string" ? dirname(path) : new URL("../", path);
          if (!existsSync(parent)) {
            mkdirSync(parent, { recursive: true });
          }

          writeFileSync(path, content, {
            encoding: "utf-8",
          });
          return path;
        }),
        () => undefined
      )
    )
);
