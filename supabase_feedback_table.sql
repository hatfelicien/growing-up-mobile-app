-- Create lesson_feedback table for storing user comments and suggestions
-- Run this query in your Supabase SQL Editor
-- Copy the entire content below and paste it into Supabase SQL Editor, then click RUN

CREATE TABLE lesson_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_lesson_feedback_module_lesson ON lesson_feedback(module_id, lesson_id);
CREATE INDEX idx_lesson_feedback_created_at ON lesson_feedback(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (anonymous users can submit)
CREATE POLICY "Allow anonymous insert" ON lesson_feedback
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reading feedback (for admin dashboard)
CREATE POLICY "Allow read access" ON lesson_feedback
  FOR SELECT
  USING (true);
