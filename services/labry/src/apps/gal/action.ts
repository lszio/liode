import { z } from "zod";
import { curry } from "@ferld/likit";
import { Database, Item } from "./protocol";

export const CreateItemAction = z.object({
  type: z.literal("createItem"),
  source: z.string(),
  group: z.string(),
  name: z.string(),
  payload: Item.deepPartial(),
});

export type CreateItemAction = z.infer<typeof CreateItemAction>;

export const CreateGroupAction = z.object({
  type: z.literal("createGroup"),
  source: z.string(),
  group: z.string(),
  payload: z.array(Item),
});

export type CreateGroupAction = z.infer<typeof CreateGroupAction>;

export const createGroup = curry(
  (action: CreateGroupAction, db: Database): Database => {
    const { source, group, payload } = action;
    if (!db[source]) {
      throw new Error(`no such source ${source}`);
    } else if (db[source][group]) {
      throw new Error(`already have group ${group}`);
    }

    db[source][group] = payload;

    return {
      [source]: db[source],
    };
  }
);

export const createItem = curry(
  (action: CreateItemAction, db: Database): Database => {
    const { source, group, name, payload } = action;

    if (!db[source]) {
      throw new Error(`no such source ${source}`);
    } else if (!db[source][group]) {
      throw new Error(`no such group ${group} in ${source}`);
    } else if (db[source][group].find((item) => item[name] === name)) {
      throw new Error(`already have item with name ${name}`);
    }

    db[source][group].push({ tags: [], ...payload, name });

    return {
      [source]: db[source],
    };
  }
);

export type Action = CreateItemAction | CreateGroupAction;
