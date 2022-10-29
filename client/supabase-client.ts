import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ouzvpqskhrgenydzutij.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91enZwcXNraHJnZW55ZHp1dGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU5NTQ0NDIsImV4cCI6MTk3MTUzMDQ0Mn0.xylDpSWKfPVx8VkOHvy3f13ZTFkPKdkJH2u4leXVOvg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
