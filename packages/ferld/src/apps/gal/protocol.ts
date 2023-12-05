import { z } from "zod";

export const Item = z
  .object({
    name: z.string(),
    tags: z.array(z.string()),
    data: z.record(z.string(), z.any()),
  })
  .passthrough();

export type Item = z.infer<typeof Item>;

export const SourceItem = Item.extend({
  data: z.object({
    label: z.string().optional(),
    path: z.string(),
  }),
});

export type SourceItem = z.infer<typeof SourceItem>;

export type FlatItem<I extends Item = Item> = I & {
  source: string;
  group: string;
};

export const Source = z.record(z.string(), z.array(Item));

export type Source = z.infer<typeof Source>;

export const Database = z.record(z.string(), Source).and(
  z.object({
    meta: z.record(z.string(), z.array(SourceItem).or(z.any())).optional(),
  })
);

export type Database = z.infer<typeof Database>;
