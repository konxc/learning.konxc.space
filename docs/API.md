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
