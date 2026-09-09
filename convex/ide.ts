import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//lav en ide
export const createIdea = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("idea", {
      title: args.title,
      description: args.description,
    });
  },
});

//hent ideen fra convex så den kan vises i ui
export const getIdeas = query({
    args: {},
  
    handler: async (ctx) => {
      return await ctx.db.query("idea").collect();
    },
  });

  //så man kan redigerer i den
  export const updateIdea = mutation({
    args: {
      ideaId: v.id("idea"),
      title: v.string(),
      description: v.optional(v.string()),
    },
  
    handler: async (ctx, args) => {
      await ctx.db.patch("idea", args.ideaId, {
        title: args.title,
        description: args.description,
      });
    },
  });
  
  //så man kan slette den
  export const deleteIdea = mutation({
    args: {
      ideaId: v.id("idea"),
    },
  
    handler: async (ctx, args) => {
      await ctx.db.delete("idea", args.ideaId);
    },
  });