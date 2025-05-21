import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
