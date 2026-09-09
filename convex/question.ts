import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//lav en spørgsmål
export const createQuestion = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("question", {
      title: args.title,
      description: args.description,
    });
  },
});

//hent spørgsmålet fra convex så den kan vises i ui
export const getQuestion = query({
    args: {},
  
    handler: async (ctx) => {
      return await ctx.db.query("question").collect();
    },
  });

  //så man kan redigerer i den
  export const updateQuestion = mutation({
    args: {
        questionId: v.id("question"),
      title: v.string(),
      description: v.optional(v.string()),
    },
  
    handler: async (ctx, args) => {
      await ctx.db.patch("question", args.questionId, {
        title: args.title,
        description: args.description,
      });
    },
  });
  
  //så man kan slette den
  export const deleteQuestion = mutation({
    args: {
        questionId: v.id("question"),
    },
  
    handler: async (ctx, args) => {
      await ctx.db.delete("question", args.questionId);
    },
  });