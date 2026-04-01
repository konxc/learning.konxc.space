# API Documentation

API endpoints dan integrasi untuk platform **"Naik Kelas by Koneksi"**.

## 📚 Context

Platform ini mendukung sistem pembelajaran berbasis project untuk program edukasi teknologi Naik Kelas.

## Status

🚧 **Work in Progress** - Documentation akan dilengkapi seiring development

---

## Authentication Endpoints

### Login

- **Endpoint**: `POST /demo/lucia/login?/login`
- **Description**: Authenticate user dengan username dan password
- **Status**: ✅ Implemented

### Register

- **Endpoint**: `POST /demo/lucia/login?/register`
- **Description**: Register user baru
- **Status**: ✅ Implemented

### Logout

- **Endpoint**: `POST /demo/lucia?/logout`
- **Description**: Logout user dan invalidate session
- **Status**: ✅ Implemented

---

## Notification Endpoints

### SSE Notification Stream

- **Endpoint**: `GET /api/notifications/stream`
- **Auth**: Required (session cookie via Lucia)
- **Description**: Server-Sent Events stream untuk real-time notification updates
- **Status**: ✅ Implemented

**Response**: `text/event-stream`

Immediately sends initial unread count on connect, then polls every 8 seconds for new notifications. Heartbeat sent every 25 seconds to keep the connection alive.

**Event payload** (JSON in `data:` field):

```json
{
	"unreadCount": 3,
	"newNotifications": [
		{
			"id": "notif_abc123",
			"type": "course_update",
			"title": "Modul baru tersedia",
			"message": "Modul 3 sudah bisa diakses",
			"link": "/app/courses/123"
		}
	]
}
```

- `newNotifications` hanya ada jika ada notifikasi baru sejak koneksi terakhir
- Heartbeat dikirim sebagai SSE comment (`: heartbeat`) — tidak perlu diproses client

**Error responses**:

- `401 Unauthorized` — user tidak terautentikasi

---

## Future Endpoints

### User Management

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Course Management

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

---

## Database Schema

### User Table

```sql
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  age INTEGER
);
```

### Session Table

```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

---

## Authentication Flow

1. User submits login form
2. Server validates credentials
3. Server creates session
4. Client receives cookie
5. Subsequent requests include session cookie

---

**Last Updated**: 2025-01-23
