-- ============================================
-- SIMPLE VERSION - ONLY EXISTING TABLES
-- Run this if you only have: modules, users, lesson_feedback
-- ============================================

-- 1. Add relationship: lesson_feedback -> modules
ALTER TABLE lesson_feedback
ADD CONSTRAINT fk_lesson_feedback_module
FOREIGN KEY (module_id) 
REFERENCES modules(id)
ON DELETE CASCADE;

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_module_id ON lesson_feedback(module_id);

-- 3. Verify the relationship was created
SELECT
    tc.table_name, 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'lesson_feedback';

-- ============================================
-- WHAT THIS DOES:
-- ============================================
-- Creates a relationship between lesson_feedback and modules
-- If a module is deleted, all its feedback is automatically deleted
-- Ensures data integrity - can't have feedback for non-existent modules
