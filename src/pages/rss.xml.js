import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = await getCollection("blog");

  const sortedBlogPosts = blog.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate)
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedBlogPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: post.data.external? post.data.crosspostURL:`/tech/blog/${post.slug}/`,
    })),
  });
}
