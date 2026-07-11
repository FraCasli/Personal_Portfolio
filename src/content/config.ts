import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      code: z.string(),
      category: z.enum(["professional", "university"]),
      order: z.number(),
      details: z.array(z.object({ label: z.string(), value: z.string() })),
      gallery: z.array(
        z.object({
          image: image(),
          alt: z.string(),
          caption: z.string().optional(),
        })
      ),
    }),
});

export const collections = { projects };
