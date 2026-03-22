-- Add quiz column to modules table
-- Run this in Supabase SQL Editor

ALTER TABLE modules ADD COLUMN IF NOT EXISTS quiz JSONB DEFAULT '[]'::jsonb;

-- Example of what a quiz question looks like in the JSON array:
-- [
--   {
--     "id": "1234567890",
--     "question": "What is puberty?",
--     "options": ["A stage of growth", "A disease", "A type of food", "A sport"],
--     "correctIndex": 0,
--     "explanation": "Puberty is a natural stage of growth and development."
--   }
-- ]
