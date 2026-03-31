import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// Plan limits configuration
export const PLAN_LIMITS = {
	free: {
		courses: 3,
		members: 10,
		workspaces: 1,
		storageMB: 500
	},
	pro: {
		courses: 20,
		members: 50,
		workspaces: 5,
		storageMB: 5120 // 5GB
	},
	enterprise: {
		courses: Infinity,
		members: Infinity,
		workspaces: Infinity,
		storageMB: 51200 // 50GB
	}
};

export type PlanType = keyof typeof PLAN_LIMITS;

export interface PlanFeatures {
	canCreateCourse: boolean;
	canAddMember: boolean;
	canCreateWorkspace: boolean;
	customBranding: boolean;
	analytics: boolean;
	apiAccess: boolean;
	customDomain: boolean;
	sso: boolean;
}

/**
 * Get the organization's plan type
 */
export async function getOrgPlanType(orgId: string): Promise<PlanType> {
	const org = await db
		.select({ planType: schema.organization.planType })
		.from(schema.organization)
		.where(eq(schema.organization.id, orgId))
		.limit(1);

	return (org[0]?.planType as PlanType) || 'free';
}

/**
 * Check if organization can create a new course
 */
export async function canCreateCourse(
	orgId: string
): Promise<{ allowed: boolean; reason?: string }> {
	const planType = await getOrgPlanType(orgId);
	const limit = PLAN_LIMITS[planType].courses;

	if (limit === Infinity) return { allowed: true };

	// Count existing courses
	const courses = await db
		.select({ count: schema.course.id })
		.from(schema.course)
		.where(eq(schema.course.orgId, orgId));

	const currentCount = courses.length;

	if (currentCount >= limit) {
		return {
			allowed: false,
			reason: `You've reached the limit of ${limit} courses on the ${planType} plan. Upgrade to create more.`
		};
	}

	return { allowed: true };
}

/**
 * Check if organization can add a new member
 */
export async function canAddMember(orgId: string): Promise<{ allowed: boolean; reason?: string }> {
	const planType = await getOrgPlanType(orgId);
	const limit = PLAN_LIMITS[planType].members;

	if (limit === Infinity) return { allowed: true };

	// Count existing members
	const members = await db
		.select({ count: schema.organizationMember.id })
		.from(schema.organizationMember)
		.where(eq(schema.organizationMember.orgId, orgId));

	const currentCount = members.length;

	if (currentCount >= limit) {
		return {
			allowed: false,
			reason: `You've reached the limit of ${limit} members on the ${planType} plan. Upgrade to add more.`
		};
	}

	return { allowed: true };
}

/**
 * Check if organization can create a new workspace
 */
export async function canCreateWorkspace(
	orgId: string
): Promise<{ allowed: boolean; reason?: string }> {
	const planType = await getOrgPlanType(orgId);
	const limit = PLAN_LIMITS[planType].workspaces;

	if (limit === Infinity) return { allowed: true };

	// Count existing workspaces
	const workspaces = await db
		.select({ count: schema.workspace.id })
		.from(schema.workspace)
		.where(eq(schema.workspace.orgId, orgId));

	const currentCount = workspaces.length;

	if (currentCount >= limit) {
		return {
			allowed: false,
			reason: `You've reached the limit of ${limit} workspaces on the ${planType} plan. Upgrade to create more.`
		};
	}

	return { allowed: true };
}

/**
 * Get all features for the organization's plan
 */
export async function getPlanFeatures(orgId: string): Promise<PlanFeatures> {
	const planType = await getOrgPlanType(orgId);

	return {
		canCreateCourse: true, // Checked separately with limits
		canAddMember: true, // Checked separately with limits
		canCreateWorkspace: true, // Checked separately with limits
		customBranding: planType !== 'free',
		analytics: planType !== 'free',
		apiAccess: planType === 'enterprise',
		customDomain: planType === 'enterprise',
		sso: planType === 'enterprise'
	};
}

/**
 * Get plan limit for display
 */
export function getPlanLimit(
	planType: PlanType,
	resource: keyof typeof PLAN_LIMITS.free
): number | string {
	const limit = PLAN_LIMITS[planType][resource];
	return limit === Infinity ? 'Unlimited' : limit;
}
