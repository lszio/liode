import { z } from "zod";
import { Database, Item } from "./protocol";

export const CreateSourcePayload = z.object({
  source: z.string(),
  path: z.string(),
});

export const CreateGroupPayload = CreateSourcePayload.omit({
  path: true,
}).extend({
  source: z.string(),
  group: z.string(),
  items: z.array(Item).optional(),
});

export const CreateItemPayload = CreateGroupPayload.omit({
  items: true,
}).extend({
  name: z.string(),
  tags: z.array(z.string()),
  data: z.record(z.string(), z.any()),
});

export const CreatePayload =
  CreateSourcePayload.or(CreateGroupPayload).or(CreateItemPayload);

export type CreatePayload = z.infer<typeof CreatePayload>;

export function create(db: Database, payload: CreatePayload) {
  //
}
