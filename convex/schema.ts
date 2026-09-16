import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

//Auth fra convex kopiret ind fra convex docs
import { authTables } from "@convex-dev/auth/server";

// Her opretter man tabeller i Convex og definerer, hvilke felter de skal indeholde.
export default defineSchema({
  ...authTables,

  idea: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
  }),

  question: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
  }),

  post: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),

    images: v.optional(
      v.array(v.id("_storage"))
    ),

    status: v.union(
      v.literal("draft"),
      v.literal("klar"),
      v.literal("planlagt"),
      v.literal("postet")
    ),

    ansvarlig: v.union(
      v.literal("Anton"),
      v.literal("Alberte"),
      v.literal("Begge")
    ),
  }).index("by_date", ["date"]),
});



