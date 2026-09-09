import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("post", {
      title: args.title,
      description: args.description,
      date: args.date,
      status: "draft",
      ansvarlig: "Begge",
      images: args.images ?? [],
    });
  },
});

export const getPosts = query({
  args: {},

  handler: async (ctx) => {
    const posts = await ctx.db.query("post").collect();

    return await Promise.all(
      posts.map(async (post) => ({
        ...post,

        imageUrls: await Promise.all(
          (post.images ?? []).map((image) =>
            ctx.storage.getUrl(image)
          )
        ),
      }))
    );
  },
});

export const savePost = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),

    status: v.union(
      v.literal("draft"),
      v.literal("klar"),
      v.literal("postet")
    ),

    ansvarlig: v.union(
      v.literal("Anton"),
      v.literal("Alberte"),
      v.literal("Begge")
    ),

    images:   v.array(v.id("_storage"))
  },

  handler: async (ctx, args) => {
    const existingPost = await ctx.db
      .query("post")
      .withIndex("by_date", (q) =>
        q.eq("date", args.date)
      )
      .unique();

    // Opdater eksisterende post
    if (existingPost) {
      await ctx.db.patch(existingPost._id, {
        title: args.title,
        description: args.description,
        status: args.status,
        ansvarlig: args.ansvarlig,

        ...(args.images !== undefined
          ? { images: args.images }
          : {}),
      });

      return existingPost._id;
    }

    // Opret ny post
    return await ctx.db.insert("post", {
      title: args.title,
      description: args.description,
      date: args.date,
      status: args.status,
      ansvarlig: args.ansvarlig,
      images: args.images ?? [],
    });
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("post"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});

export const generateUploadUrl = mutation({
  args: {},

  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const deletePostImage = mutation({
  args: {
    postId: v.id("post"),
    imageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const post = await ctx.db.get("post", args.postId);

    if (!post) {
      return;
    }

    // Slet kun det valgte billede fra storage
    await ctx.storage.delete(args.imageId);

    // Fjern kun det valgte billede fra images-arrayet
    await ctx.db.patch(post._id, {
      images: (post.images ?? []).filter(
        (image) => image !== args.imageId
      ),
    });
  },
});