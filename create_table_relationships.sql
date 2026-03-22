-- ============================================
-- CREATE TABLE RELATIONSHIPS WITH FOREIGN KEYS
-- Run this in Supabase SQL Editor
-- ============================================

-- First, let's check what tables you have
-- You should have: modules, users, lesson_feedback, user_progress, user_quiz_scores

-- ============================================
-- 1. ADD FOREIGN KEYS TO lesson_feedback
-- ============================================

-- Add foreign key to modules table
ALTER TABLE lesson_feedback
ADD CONSTRAINT fk_lesson_feedback_module
FOREIGN KEY (module_id) 
REFERENCES modules(id)
ON DELETE CASCADE;

-- Note: lesson_id is stored in modules.lessons JSON, so we can't create a direct FK
-- But we can add a check to ensure module exists

-- ============================================
-- 2. ADD FOREIGN KEYS TO user_progress (if table exists)
-- ============================================

-- Check if user_progress table exists, if yes:
ALTER TABLE user_progress
ADD CONSTRAINT fk_user_progress_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE user_progress
ADD CONSTRAINT fk_user_progress_module
FOREIGN KEY (module_id)
REFERENCES modules(id)
ON DELETE CASCADE;

-- ============================================
-- 3. ADD FOREIGN KEYS TO user_quiz_scores (if table exists)
-- ============================================

-- Check if user_quiz_scores table exists, if yes:
ALTER TABLE user_quiz_scores
ADD CONSTRAINT fk_user_quiz_scores_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE user_quiz_scores
ADD CONSTRAINT fk_user_quiz_scores_module
FOREIGN KEY (module_id)
REFERENCES modules(id)
ON DELETE CASCADE;

-- ============================================
-- 4. CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_module_id ON lesson_feedback(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_user_id ON user_quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_scores_module_id ON user_quiz_scores(module_id);

-- ============================================
-- 5. VERIFY RELATIONSHIPS
-- ============================================

-- Check all foreign keys
SELECT
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================
-- WHAT THESE RELATIONSHIPS DO:
-- ============================================

-- lesson_feedback -> modules
--   When a module is deleted, all its feedback is deleted too (CASCADE)

-- user_progress -> users & modules
--   When a user is deleted, their progress is deleted (CASCADE)
--   When a module is deleted, all progress for that module is deleted (CASCADE)

-- user_quiz_scores -> users & modules
--   When a user is deleted, their quiz scores are deleted (CASCADE)
--   When a module is deleted, all quiz scores for that module are deleted (CASCADE)

-- ============================================
-- NOTES:
-- ============================================

-- 1. If any table doesn't exist, that part will fail - that's OK
-- 2. ON DELETE CASCADE means: when parent is deleted, children are deleted too
-- 3. This ensures data integrity - no orphaned records
-- 4. Indexes improve query performance on foreign key columns
