import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const SaveTemplate = mutation({
    args: {
        tid: v.string(),
        design: v.any(),
        email: v.string(),
        description: v.string(),
        photo: v.optional(v.string()),
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
        photo: v.optional(v.string()),
    },
    handler: async (ctx,args) => {
        // Get Doc Id
        const result = await ctx.db.query('emailTemplates')
            .filter(q=>q.eq(q.field('tid'),args.tid))
            .collect();

        const docId = result[0]._id;
        //console.log(docId);

        // Update that docId
        await ctx.db.patch(docId, {
            design: args.design,
            photo: args.photo ?? result[0].photo,
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
        tid: v.string(),    
        design: v.array(v.any()), 
        description: v.any(), 
        email: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const newTemplateId = await ctx.db.insert('emailTemplates', {
                tid: args.tid,
                design: args.design,
                description: args.description,
                email: args.email,
            });
            return newTemplateId;
        } catch (e) {
            console.error("Convex createTemplate error:", e);
            throw new Error("Failed to create template: " + e.message);
        }
    }
});

export const DeleteTemplate = mutation({
    args: { tid: v.string(), email: v.string() },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("emailTemplates")
            .filter(q => q.and(
                q.eq(q.field("tid"), args.tid),
                q.eq(q.field("email"), args.email)
            ))
            .collect();

        if (result.length > 0) {
            await ctx.db.delete(result[0]._id);
        }
    }
});

export const UpdateTemplateDescription = mutation({
    args: {
        tid: v.string(),
        email: v.string(),
        description: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("emailTemplates")
            .filter(q => q.and(
                q.eq(q.field("tid"), args.tid),
                q.eq(q.field("email"), args.email)
            ))
            .collect();

        const doc = result?.[0];
        if (!doc) {
        throw new Error("Template not found");
        }

        await ctx.db.patch(doc._id, { description: args.description });
    }
});
