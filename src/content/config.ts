import { z, defineCollection } from "astro:content";
const blogSchema = z.object({
    title: z.string(),
    subtitle:z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    crosspostURL: z.string().optional(),
    external: z.boolean().default(false).optional(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'tags must be unique',
    }).optional(),
});

const projectSchema = z.object({
    title:z.string(),
    description:z.string(),
    url:z.string().url(),
    heroImage:z.string().regex(/\/tech\/.*(\.png|\.jpg|\.webpp)/),
    languages:z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'languages must be unique',
    }),
    badge:z.string()
})



export type BlogSchema = z.infer<typeof blogSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;

const blogCollection = defineCollection({ schema: blogSchema });
const projectCollection = defineCollection({schema: projectSchema});


export const collections = {
    'blog': blogCollection,
    'projects': projectCollection
}