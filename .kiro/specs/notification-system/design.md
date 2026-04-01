# Design: Notification System Enhancement

## Arsitektur

```
src/routes/api/notifications/
├── stream/
│   └── +server.ts          # SSE endpoint — GET /api/notifications/stream
├── +server.ts               # GET (list), POST (create), PUT (mark read)
└── [id]/
    └── +server.ts           # PUT /api/notifications/:id (mark single read)

src/lib/server/
└── notifications.ts         # Helper: createNotification(), sendNotification()

src/lib/components/
├── layouts/
│   └── DashboardHeader.svelte  # Update: SSE listener + badge count
└── ui/
    └── NotificationDropdown.svelte  # Dropdown preview (top 5 unread)
```

## SSE Flow

```
Client (DashboardHeader)
  └── EventSource('/api/notifications/stream')
        ├── onmessage: update unreadCount $state
        ├── onmessage: push toast jika type penting
        └── onerror: reconnect setelah 5 detik

Server (/api/notifications/stream)
  └── ReadableStream dengan heartbeat setiap 30 detik
  └── Poll DB setiap 5 detik untuk notifikasi baru
  └── Kirim event: { id, type, message, createdAt }
```

## Data Model (existing table)

```typescript
// Tabel notification sudah ada di schema.ts
// Tambahkan kolom jika belum ada:
// - type: text (notification type enum)
// - readAt: timestamp (null = unread)
// - metadata: text (JSON untuk data tambahan)
```

## Notification Helper

```typescript
// src/lib/server/notifications.ts
export async function createNotification(params: {
	userId: string;
	type: NotificationType;
	message: string;
	metadata?: Record<string, unknown>;
}): Promise<void>;
```

## Preferences Schema

```typescript
// Di userPreferences.notificationSettings (JSON column)
interface NotificationSettings {
	[type: string]: {
		inApp: boolean;
		email: boolean;
	};
}

// Default
const defaultSettings: NotificationSettings = {
	enrollment_activated: { inApp: true, email: true },
	submission_graded: { inApp: true, email: true },
	checkpoint_due: { inApp: true, email: false },
	broadcast_received: { inApp: true, email: false },
	badge_earned: { inApp: true, email: false },
	payment_confirmed: { inApp: true, email: true }
};
```

## Komponen Update

### DashboardHeader.svelte

```svelte
// Tambahkan SSE listener
let unreadCount = $state(0);

$effect(() => {
  const es = new EventSource('/api/notifications/stream');
  es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    unreadCount = data.unreadCount;
    if (data.important) showToast(data.message);
  };
  return () => es.close();
});
```
