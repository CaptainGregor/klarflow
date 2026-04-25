import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://sveoxburptyhlqxvznrm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZW94YnVycHR5aGxxeHZ6bnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDI4MTgsImV4cCI6MjA5MjI3ODgxOH0.5PY0A522akTwOXx_CgSkv9b_wW0hFPCS0L3vdW4LaK4"
);