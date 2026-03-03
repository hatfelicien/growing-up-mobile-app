import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsgsvwjmgoxyzzpzsssq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZ3N2d2ptZ294eXp6cHpzc3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc3MDgsImV4cCI6MjA4NjkxMzcwOH0._lRLVear1-7I78XWiPtpApo0AxQO6wMqFx_yZyB3XxQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
