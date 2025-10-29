import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    // Get all coupons with creator info
    const coupons = await db
        .select({
            id: schema.coupon.id,
            code: schema.coupon.code,
            type: schema.coupon.type,
            discountType: schema.coupon.discountType,
            discountValue: schema.coupon.discountValue,
            maxUses: schema.coupon.maxUses,
            currentUses: schema.coupon.currentUses,
            validFrom: schema.coupon.validFrom,
            validUntil: schema.coupon.validUntil,
            description: schema.coupon.description,
            isActive: schema.coupon.isActive,
            createdAt: schema.coupon.createdAt,
            creator: {
                username: schema.user.username
            }
        })
        .from(schema.coupon)
        .innerJoin(schema.user, eq(schema.coupon.createdBy, schema.user.id))
        .orderBy(schema.coupon.createdAt);

    return {
        coupons
    };
};

function generateCouponCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const length = 6 + Math.floor(Math.random() * 7);
    
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
}

export const actions: Actions = {
    toggle: async (event) => {
        const user = await requireAdmin(event);
        const body = await event.request.json();
        const { couponId } = body;
        
        // Get current coupon
        const coupons = await db
            .select()
            .from(schema.coupon)
            .where(eq(schema.coupon.id, couponId))
            .limit(1);
        
        if (coupons.length === 0) {
            return json({ error: 'Coupon not found' }, { status: 404 });
        }
        
        const coupon = coupons[0];
        
        // Toggle status
        await db
            .update(schema.coupon)
            .set({ isActive: !coupon.isActive })
            .where(eq(schema.coupon.id, couponId));
        
        return json({ success: true });
    },
    
    duplicate: async (event) => {
        const user = await requireAdmin(event);
        const body = await event.request.json();
        const { couponId } = body;
        
        // Get original coupon
        const coupons = await db
            .select()
            .from(schema.coupon)
            .where(eq(schema.coupon.id, couponId))
            .limit(1);
        
        if (coupons.length === 0) {
            return json({ error: 'Coupon not found' }, { status: 404 });
        }
        
        const original = coupons[0];
        
        // Generate unique code
        let newCode = generateCouponCode();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await db
                .select()
                .from(schema.coupon)
                .where(eq(schema.coupon.code, newCode))
                .limit(1);
            
            if (existing.length === 0) break;
            
            newCode = generateCouponCode();
            attempts++;
        }
        
        // Create duplicate with new code
        const newId = crypto.randomUUID();
        await db.insert(schema.coupon).values({
            id: newId,
            code: newCode,
            type: original.type,
            discountType: original.discountType,
            discountValue: original.discountValue,
            maxUses: original.maxUses,
            currentUses: 0, // Reset usage
            validFrom: original.validFrom,
            validUntil: original.validUntil,
            description: original.description ? `${original.description} (Copy)` : null,
            applicableCourses: original.applicableCourses,
            minPurchaseAmount: original.minPurchaseAmount,
            createdBy: user.id,
            isActive: original.isActive
        });
        
        return json({ success: true });
    }
};
