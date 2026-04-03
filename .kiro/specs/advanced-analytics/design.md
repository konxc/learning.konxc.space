# Design: Advanced Analytics

## Data Sources (existing tables)

- `lessonProgress` — completion data, timestamps
- `trackerActivity` — activity log dengan timestamps
- `submission` + `submissionGrade` — assessment performance
- `enrollment` — enrollment funnel
- `transaction` + `paymentProof` — revenue data
- `userTracker` — streak, points, tier

## Key Queries

### MAU/DAU

```sql
SELECT DATE_TRUNC('day', created_at) as day, COUNT(DISTINCT user_id) as dau
FROM tracker_activity
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY day ORDER BY day;
```

### Completion Funnel

```sql
SELECT
  COUNT(*) as enrolled,
  COUNT(CASE WHEN completed_lessons > 0 THEN 1 END) as started,
  COUNT(CASE WHEN progress_pct >= 50 THEN 1 END) as halfway,
  COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed
FROM enrollment WHERE course_id = $1;
```

## Routes

- `/app/admin/analytics` — platform analytics (new)
- `/app/learning/analytics` — personal analytics (new)
- `/app/organizations/[id]/analytics` — already exists, enhance
