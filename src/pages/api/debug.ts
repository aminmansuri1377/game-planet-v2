import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      "https://ybkqlbrfanevwwmeykpr.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlia3FsYnJmYW5ldnd3bWV5a3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc1NDIsImV4cCI6MjA1MjkzMzU0Mn0.It8KICwnXtW9Ekw6mCvt6m45fPBG0D2paqUdIyn0wJ4"!
    );

    const { data, error } = await supabase
      .from("your_table")
      .select("*")
      .limit(1);

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
  }
}
