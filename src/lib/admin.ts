import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function getAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("id,display_name,is_active").eq("id", user.id).eq("is_active", true).maybeSingle();
  return profile ? { supabase, user, profile } : null;
}
export async function requireAdmin() { const admin = await getAdmin(); if (!admin) redirect("/admin"); return admin; }
