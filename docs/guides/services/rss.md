---
title: RSS
description: "Build RSS endpoints and parse feeds for content channels and embeds."
---

# RSS

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { getCollection } from "astro:content";

const { useCreateRssEndpoint } = RssService.getInstance();

export const GET = useCreateRssEndpoint({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: async () => {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    }));
  },
});
```

---
