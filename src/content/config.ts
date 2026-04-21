import { z, defineCollection } from "astro:content";

const validTags = z.enum([
    "frameworks",
    "components",
    "open-source",
    "project-management",
    "legal",
    "ai",
    "security",
    "cryptography",
    "encryption",
    "performance",
    "optimization",
    "design",
    "web",
    "css",
    "html",
    "frontend",
    "ui-ux",
    "backend",
    "networking",
    "hardware",
    "testing",
    "theory",
    "vcs",
    "terminology",
    "web",
    "packages",
    "teaching",
    "opinion",
    "personal",
    "philosophy",
    "tutorial",
    "games",
    "floodr",

    "scorch", // TODO: turn this into a difficulty system



    "svelte", // TODO: turn this into it's own list of libraries
    "react", // TODO: turn this into it's own list of libraries
    "nextJS", // TODO: turn this into it's own list of libraries
    "astro", // TODO: turn this into it's own list of libraries
    "flask", // TODO: turn this into it's own list of libraries
    "jinja", // TODO: turn this into it's own list of libraries
    "npm", // TODO: turn this into it's own list of libraries
    "node", // TODO: turn this into it's own list of libraries

    "java", // TODO: turn this into it's own list of languages
    "python", // TODO: turn this into it's own list of languages
    "rust", // TODO: turn this into it's own list of languages
    "C", // TODO: turn this into it's own list of languages
    "go", // TODO: turn this into it's own list of languages
    "javascript", // TODO: turn this into it's own list of languages
    "php", // TODO: turn this into it's own list of languages


])


const blogSchema = z.object({
    title: z.string(),
    subtitle:z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    crosspostURL: z.string().optional(),
    external: z.boolean().default(false).optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(validTags),
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