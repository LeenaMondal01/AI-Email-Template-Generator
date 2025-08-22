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
