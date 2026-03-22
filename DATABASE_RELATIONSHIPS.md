# 📊 Database Table Relationships

## Current Tables

Based on your app, you should have these tables:

1. **modules** - Stores learning modules
2. **users** - Stores admin users
3. **lesson_feedback** - Stores user comments/suggestions
4. **user_progress** (optional) - Tracks lesson completion
5. **user_quiz_scores** (optional) - Stores quiz results

## Relationship Diagram

```
┌─────────────────┐
│     modules     │
│─────────────────│
│ id (PK)         │◄─────────┐
│ title           │          │
│ description     │          │
│ icon            │          │
│ lessons (JSON)  │          │
└─────────────────┘          │
                             │
                             │ Foreign Key
                             │ (module_id)
                             │
┌─────────────────┐          │
│ lesson_feedback │          │
│─────────────────│          │
│ id (PK)         │          │
│ module_id (FK)  │──────────┘
│ lesson_id       │
│ comment         │
│ created_at      │
└─────────────────┘


┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◄─────────┐
│ username        │          │
│ password        │          │
│ role            │          │
└─────────────────┘          │
                             │
                             │ Foreign Key
                             │ (user_id)
                             │
┌─────────────────┐          │
│ user_progress   │          │
│─────────────────│          │
│ id (PK)         │          │
│ user_id (FK)    │──────────┘
│ module_id (FK)  │──────────┐
│ lesson_id       │          │
│ completed       │          │
│ completed_at    │          │
└─────────────────┘          │
                             │
                             │
                             │
┌─────────────────┐          │
│user_quiz_scores │          │
│─────────────────│          │
│ id (PK)         │          │
│ user_id (FK)    │──────────┤
│ module_id (FK)  │──────────┘
│ score           │
│ total_questions │
│ completed_at    │
└─────────────────┘
```

## Relationships Explained

### 1. lesson_feedback → modules
- **Type:** Many-to-One
- **Meaning:** Many feedback entries can belong to one module
- **Action:** When module is deleted, all its feedback is deleted (CASCADE)

### 2. user_progress → users
- **Type:** Many-to-One
- **Meaning:** Many progress records can belong to one user
- **Action:** When user is deleted, all their progress is deleted (CASCADE)

### 3. user_progress → modules
- **Type:** Many-to-One
- **Meaning:** Many progress records can belong to one module
- **Action:** When module is deleted, all progress for that module is deleted (CASCADE)

### 4. user_quiz_scores → users
- **Type:** Many-to-One
- **Meaning:** Many quiz scores can belong to one user
- **Action:** When user is deleted, all their scores are deleted (CASCADE)

### 5. user_quiz_scores → modules
- **Type:** Many-to-One
- **Meaning:** Many quiz scores can belong to one module
- **Action:** When module is deleted, all scores for that module are deleted (CASCADE)

## Benefits of These Relationships

✅ **Data Integrity** - Can't have feedback for non-existent modules
✅ **Automatic Cleanup** - Deleting a module removes all related data
✅ **Better Queries** - Can easily join tables to get related data
✅ **Performance** - Indexes on foreign keys speed up queries

## How to Apply

### Option 1: Full Setup (All Tables)
Run: `create_table_relationships.sql`

### Option 2: Simple Setup (Only lesson_feedback)
Run: `simple_relationships.sql`

## Verify Relationships

After running the SQL, check relationships with:

```sql
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS references_table
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

## Example Queries Using Relationships

### Get all feedback with module names:
```sql
SELECT 
    lf.comment,
    lf.created_at,
    m.title as module_title
FROM lesson_feedback lf
JOIN modules m ON lf.module_id = m.id
ORDER BY lf.created_at DESC;
```

### Get user progress with module details:
```sql
SELECT 
    u.username,
    m.title as module_title,
    up.completed,
    up.completed_at
FROM user_progress up
JOIN users u ON up.user_id = u.id
JOIN modules m ON up.module_id = m.id;
```

### Get quiz scores with user and module info:
```sql
SELECT 
    u.username,
    m.title as module_title,
    uqs.score,
    uqs.total_questions,
    uqs.completed_at
FROM user_quiz_scores uqs
JOIN users u ON uqs.user_id = u.id
JOIN modules m ON uqs.module_id = m.id
ORDER BY uqs.completed_at DESC;
```
