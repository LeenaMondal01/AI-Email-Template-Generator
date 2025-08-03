import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const SaveTemplate = mutation({
    args: {
        tid: v.string(),
        design: v.any(),
        email: v.string(),
        description: v.string(),
    },
    handler: async (ctx,args) => {
        try {
            const result = await ctx.db.insert('emailTemplates', {
                tid: args.tid,
                design: args.design,
                email: args.email,
                description: args.description,
            })
            return result;
        }
        catch(e) {

        }
    }
})


export const GetTemplateDesign = query({
    args: {
        email: v.string(),
        tid: v.string()
    },
    handler: async(ctx,args) => {
        try{
            const result = await ctx.db.query('emailTemplates')
                .filter((q) => q.and(q.eq(q.field('tid'),args.tid),q.eq(q.field('email'),args.email))).collect();
            
            return result[0];
        }
        catch(e) {
            return {};
        }
    }
})

export const UpdateTemplateDesign = mutation({
    args: {
        tid: v.string(),
        design: v.any(),   // Email Template Design
    },
    handler: async (ctx,args) => {
        // Get Doc Id
        const result = await ctx.db.query('emailTemplates')
            .filter(q=>q.eq(q.field('tid'),args.tid))
            .collect();

    //     if (!result || result.length === 0 || !result[0]?._id) {
    //   console.error("Update failed: No template found for tid", args.tid);
    //   throw new Error(`Template with tid '${args.tid}' not found.`);
    // }
        const docId = result[0]._id;
        //console.log(docId);

        // Update that docId
        await ctx.db.patch(docId, {
            design: args.design
        });
    }
})

export const GetAllUserTemplate = query({
    args: {
        email: v.string()
    },
    handler: async(ctx,args) => {
        const result = await ctx.db.query('emailTemplates')
            .filter(q=>q.eq(q.field('email'),args.email))
            .collect();
        
        return result;
    }
})

export const createTemplate = mutation({
    args: {
        tid: v.string(),        // Matches schema
        design: v.array(v.any()), // Matches schema
        description: v.any(),   // Matches schema
        email: v.string(),      // Matches schema
        // If your schema includes 'name: v.string()' then add name: v.string() here too
        // If your schema includes 'userId: v.id("users")' then add userId: v.id("users") here too
    },
    handler: async (ctx, args) => {
        try {
            const newTemplateId = await ctx.db.insert('emailTemplates', {
                tid: args.tid,
                design: args.design,
                description: args.description,
                email: args.email,
                // name: args.name, // Add if you accept 'name' in args and schema
                // userId: args.userId, // Add if you accept 'userId' in args and schema
                // createdAt: Date.now(), // Add if you have this in schema
                // updatedAt: Date.now(), // Add if you have this in schema
            });
            return newTemplateId;
        } catch (e) {
            console.error("Convex createTemplate error:", e);
            throw new Error("Failed to create template: " + e.message);
        }
    }
});




// convex/emailTemplate.ts (or wherever it is)
// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const SaveTemplate = mutation({
//     args: {
//         tid: v.string(), // Keep this as it's required by client
//         design: v.any(),
//         email: v.string(), // Keep email if you still want to store it
//         description: v.string(),
//         userId: v.id("users"), // <--- Add this
//     },
//     handler: async (ctx,args) => {
//         try {
//             const result = await ctx.db.insert('emailTemplates', {
//                 tid: args.tid,
//                 design: args.design,
//                 email: args.email, // Store email too
//                 userId: args.userId, // Store userId for relationship/security
//                 description: args.description,
//                 name: "AI-Generated Template" // Add a default name
//             })
//             return result; // This returns the Convex _id
//         }
//         catch(e) {
//             console.error("Convex SaveTemplate error:", e);
//             throw new Error("Failed to save AI-generated template: " + e.message); // Better error
//         }
//     }
// });


// // convex/emailTemplate.ts
// // ... (other imports)

// export const GetTemplateDesign = query({
//     args: {
//         templateId: v.string(), // <--- Change this to v.string() because your URL is /editor/tid
//         userId: v.id("users"),
//     },
//     handler: async (ctx, args) => {
//         try {
//             // Query by tid and userId
//             const result = await ctx.db.query('emailTemplates')
//                 .filter(q => q.and(
//                     q.eq(q.field('tid'), args.templateId), // Filter by tid
//                     q.eq(q.field('userId'), args.userId)
//                 ))
//                 .first(); // Use first() as tid should be unique per user

//             if (!result) {
//                 console.warn(`Template with tid ${args.templateId} not found for user ${args.userId}.`);
//                 return null;
//             }

//             // Security check
//             if (result.userId !== args.userId) { // result is the full document here
//                 throw new Error("Unauthorized access to template.");
//             }
//             return result; // Return the full template object
//         } catch (e) {
//             console.error("Convex GetTemplateDesign error:", e);
//             throw new Error("Failed to retrieve template design.");
//         }
//     }
// });