// Minimal audit util; replace with DB insert via Drizzle when schema ready
import type { RequestEvent } from '@sveltejs/kit';

export type AuditAction = 'switch_role' | 'login' | 'logout' | 'admin_action';

export async function logAudit(_event: RequestEvent, action: AuditAction, details?: Record<string, unknown>) {
  try {
    // Placeholder: you can wire db insert here later
    console.info('[AUDIT]', action, JSON.stringify(details ?? {}));
  } catch (err) {
    console.error('[AUDIT][ERROR]', err);
  }
}


