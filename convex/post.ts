import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";


// Opret ny post
export const createPost = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    images: v.optional(v.array(v.id("_storage"))),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Du skal være logget ind");
    }

    return await ctx.db.insert("post", {
      title: args.title,
      description: args.description,
      date: args.date,
      status: "draft",
      ansvarlig: "Begge",
      images: args.images ?? [],
      ownerId: userId,
    });
  },
});

// Hent posts brugeren må se
export const getPosts = query({
  args: {},

  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }


    // Brugerens egne posts
    const ownPosts = await ctx.db
      .query("post")
      .withIndex("by_owner", (q) =>
        q.eq("ownerId", userId)
      )
      .collect();


    // Find personer som har delt posts med brugeren
    const accesses = await ctx.db
      .query("postAccess")
      .withIndex("by_viewer", (q) =>
        q.eq("viewerId", userId)
      )
      .collect();


    // Hent posts fra dem der har delt adgang
    const sharedPostGroups = await Promise.all(
      accesses.map(async (access) => {
        return await ctx.db
          .query("post")
          .withIndex("by_owner", (q) =>
            q.eq("ownerId", access.ownerId)
          )
          .collect();
      })
    );
//når jeg deler noget 

    const posts = [
      ...ownPosts,
      ...sharedPostGroups.flat(),
    ];


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

// Gem/opdater post
export const savePost = mutation({
  args: {
    postId: v.optional(v.id("post")),

    title: v.string(),

    description: v.optional(v.string()),

    date: v.string(),

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

    images: v.array(v.id("_storage")),
  },

  handler: async (ctx, args) => {

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Du skal være logget ind");
    }


    // Hvis postId findes,
    // betyder det at vi redigerer en eksisterende post
    if (args.postId) {

      const post = await ctx.db.get(
        "post",
        args.postId
      );

      if (!post) {
        throw new Error("Post findes ikke");
      }


      // Tjek om brugeren ejer posten
      const isOwner =
        post.ownerId === userId;


      // Tjek om brugeren har fået adgang
      const access = await ctx.db
        .query("postAccess")
        .withIndex("by_owner_viewer", (q) =>
          q
            .eq("ownerId", post.ownerId!)
            .eq("viewerId", userId)
        )
        .unique();

        //redigere eller læser
        const canEdit =
        isOwner || access?.role === "Rediger";

        if(!canEdit){
          throw new Error(
            "Du har ikke adgang til at redigere denne post"
          )
        }

     /*  const hasAccess =
        isOwner || access !== null;


      if (!hasAccess) {
        throw new Error(
          "Du har ikke adgang til at redigere denne post"
        );
      }
 */

      // Opdater den konkrete post
      await ctx.db.patch(args.postId, {
        title: args.title,
        description: args.description,
        date: args.date,
        status: args.status,
        ansvarlig: args.ansvarlig,
        images: args.images,
      });


      return args.postId;
    }


    // Hvis postId ikke findes,
    // opretter vi en ny post
    return await ctx.db.insert("post", {

      title: args.title,
     description: args.description,
     date: args.date,
     status: args.status,
     ansvarlig: args.ansvarlig,
     images: args.images,
     ownerId: userId,
    });
  },
});

// Slet post
export const deletePost = mutation({
  args: {
    postId: v.id("post"),
  },

  handler: async (ctx, args) => {

    // Find den bruger der prøver at slette
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Du skal være logget ind");
    }


    // Find posten
    const post = await ctx.db.get(
      "post",
      args.postId
    );

    if (!post) {
      throw new Error("Post findes ikke");
    }


    // Tjek om brugeren selv ejer posten
    const isOwner =
      post.ownerId === userId;


    const access = await ctx.db
      .query("postAccess")
      .withIndex("by_owner_viewer", (q) =>
        q
          .eq("ownerId", post.ownerId!)
          .eq("viewerId", userId)
      )
      .unique();

   /*  const hasAccess =
      isOwner || access !== null; */

      const canDelete =
      isOwner || access?.role === "Rediger";
 
    if (!canDelete) {
      throw new Error(
        "Du har ikke adgang til at slette denne post"
      );
    }

    // Personen har adgang
    // Derfor slettes posten
    await ctx.db.delete(args.postId);
  },
});

// Lav upload URL til billeder
export const generateUploadUrl = mutation({
  args: {},

  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Du skal være logget ind");
    }


    return await ctx.storage.generateUploadUrl();
  },
});

// Slet billede fra post
export const deletePostImage = mutation({
  args: {
    postId: v.id("post"),
    imageId: v.id("_storage"),
  },


  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Du skal være logget ind");
    }


    const post = await ctx.db.get(
      "post",
      args.postId
    );


    if (!post) {
      return;
    }


    if (post.ownerId !== userId) {
      throw new Error("Du må ikke ændre denne post");
    }


    await ctx.storage.delete(args.imageId);


    await ctx.db.patch(post._id, {
      images: (post.images ?? []).filter(
        (image) =>
          image !== args.imageId
      ),
    });
  },
});

// Giv en anden bruger adgang via email
export const givePostAccess = mutation({
  args: {
    email: v.string(),
  
    role: v.union(
      v.literal("Læser"),
      v.literal("Rediger")
    ),
  },


  handler: async (ctx, args) => {
    const ownerId = await getAuthUserId(ctx);
    if (!ownerId) {
      throw new Error("Du skal være logget ind");
    }

    const viewer = await ctx.db
      .query("users")
      .filter((q) =>
        q.eq(
          q.field("email"),
          args.email
        )
      )
      .unique();


    if (!viewer) {
      throw new Error(
        "Ingen bruger med denne email"
      );
    }


    if (viewer._id === ownerId) {
      throw new Error(
        "Du har allerede adgang"
      );
    }

    const existingAccess = await ctx.db
      .query("postAccess")
      .withIndex("by_owner_viewer", (q) =>
        q
          .eq("ownerId", ownerId)
          .eq("viewerId", viewer._id)
      )
      .unique();


    if (existingAccess) {
      throw new Error(
        "Brugeren har allerede adgang"
      );
    }


    return await ctx.db.insert(
      "postAccess",
      {
        ownerId,
        viewerId: viewer._id,
        role: args.role,
      }
    );
  },
  
});

// Slette deres adgang igen
export const removePostAccess = mutation({
  args: {
    accessId: v.id("postAccess"),
  },

  handler: async (ctx, args) => {

    // Hvem prøver at fjerne adgangen?
    const ownerId = await getAuthUserId(ctx);

    if (!ownerId) {
      throw new Error("Du skal være logget ind");
    }


    // Find adgangsrækken
    const access = await ctx.db.get(
      "postAccess",
      args.accessId
    );

    if (!access) {
      throw new Error("Adgangen findes ikke");
    }


    // Sørger for, at man kun kan
    // fjerne sine egne adgangsregler
    if (access.ownerId !== ownerId) {
      throw new Error(
        "Du må ikke fjerne denne adgang"
      );
    }


    // Slet kun adgangsreglen
    await ctx.db.delete(args.accessId);
  },
});

export const getPostAccess = query({
  args: {},

  handler: async (ctx) => {

    // Den bruger der ejer posts
    const ownerId = await getAuthUserId(ctx);

    if (!ownerId) {
      return [];
    }


    // Find alle personer som denne bruger
    // har givet adgang
    const accesses = await ctx.db
      .query("postAccess")
      .withIndex("by_owner_viewer", (q) =>
        q.eq("ownerId", ownerId)
      )
      .collect();


    // Find deres emails
    return await Promise.all(
      accesses.map(async (access) => {

        const user = await ctx.db.get(
          "users",
          access.viewerId
        );


        return {
          accessId: access._id,
          userId: access.viewerId,
          email: user?.email,
          role: access.role,
        };
      })
    );

  },
});

async function canAccessPost(
  ctx: any,
  post: any,
  userId: any
) {
  // Ejeren har altid adgang
  if (post.ownerId === userId) {
    return true;
  }

  // Tjek om brugeren har fået adgang
  const access = await ctx.db
    .query("postAccess")
    .withIndex("by_owner_viewer", (q: any) =>
      q
        .eq("ownerId", post.ownerId)
        .eq("viewerId", userId)
    )
    .unique();

  return access !== null;
}

export const updatePostAccessRole = mutation({
  args: {
    accessId: v.id("postAccess"),

    role: v.union(
      v.literal("Læser"),
      v.literal("Rediger")
    ),
  },

  handler: async (ctx, args) => {

    // Find den bruger der er logget ind
    const ownerId = await getAuthUserId(ctx);

    if (!ownerId) {
      throw new Error("Du skal være logget ind");
    }

    // Find adgangsrecorden
    const access = await ctx.db.get(
      "postAccess",
      args.accessId
    );

    if (!access) {
      throw new Error("Adgang findes ikke");
    }

    // Kun ejeren må ændre rollen
    if (access.ownerId !== ownerId) {
      throw new Error(
        "Du må ikke ændre denne rolle"
      );
    }

    // Ændrer rollen
    await ctx.db.patch(
      args.accessId,
      {
        role: args.role,
      }
    );
  },
});

// Role (Ejer)
//mutation skal gøre en ting - min gør to ting, det er nogo. Det er bedre at have flere mutations . savepost når man upatere noget giver ikke mening.
// Små bogstaver i min routes ideer, login mm.
//Lidt overkill med fjernAccess i sit eget komponent.
//Auth sender en token ud, hver com har et unikId.
// tidsbegræning er i config -  timer til uger der er ikke rigtig 
// jwt korte token, 
// refresh token er der meget længere
//jwt holder mig logget ind, hver gang den udløber

// getAuthUserId er jwt token 


/* import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // your providers...
  ],

  jwt: {
    durationMs: 60 * 60 * 1000, // 1 hour
  },
}); */