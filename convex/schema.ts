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

    ownerId: v.optional(v.id("users")),

  })
    .index("by_date", ["date"])
    .index("by_owner", ["ownerId"]),


  postAccess: defineTable({
    ownerId: v.id("users"),
    viewerId: v.id("users"),
    role: v.union(
      v.literal("Læser"),
      v.literal("Rediger"),
  
    ),
    // Roller på dansk, kan være ejer, ser mm
  })
    .index("by_viewer", ["viewerId"])
    .index("by_owner_viewer", [
      "ownerId",
      "viewerId"
    ]),
});