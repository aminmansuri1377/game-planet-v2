"use client";
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  if (typeof window === "undefined") return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
