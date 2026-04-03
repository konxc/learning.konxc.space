# Design: AI Integration

## Database Schema

### Tabel Baru: aiChatHistory

```typescript
export const aiChatHistory = pgTable('ai_chat_history', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	lessonId: text('lesson_id').references(() => lesson.id),
	role: text('role').notNull(), // 'user' | 'assistant'
	content: text('content').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

### Tabel Baru: promptTemplate

```typescript
export const promptTemplate = pgTable('prompt_template', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	category: text('category').notNull(), // 'coding' | 'marketing' | 'business' | 'content'
	isPublic: boolean('is_public').default(false),
	forkCount: integer('fork_count').default(0),
	forkedFrom: text('forked_from'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

## API Endpoints

- `POST /api/ai/chat` — send message, get AI response
- `GET /api/ai/recommendations` — get course recommendations

## Environment Variables

- `AI_API_KEY` — OpenAI/Anthropic API key
- `AI_MODEL` — model name (default: gpt-4o-mini)
- `AI_DAILY_LIMIT` — max messages per day per user (default: 20)
