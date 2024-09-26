import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lmzslqrjsufqwccgknws.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtenNscXJqc3VmcXdjY2drbndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNzA5ODcsImV4cCI6MjAzNjY0Njk4N30.5Q3KSGq-MQ4ZB_4ZEPOyPLKSKzmMNycMMoJJzfz5TPs";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
