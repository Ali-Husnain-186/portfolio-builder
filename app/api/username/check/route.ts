import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateSuggestions,
  normalizeUsername,
  validateUsernameFormat,
} from "@/lib/username";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("username") ?? "";
  const excludeUserId = searchParams.get("excludeUserId") ?? undefined;
  const username = normalizeUsername(raw);

  const formatError = validateUsernameFormat(username);
  if (formatError) {
    return NextResponse.json({
      available: false,
      username,
      error: formatError,
      suggestions: [],
    });
  }

  const supabase = await createClient();

  let query = supabase
    .from("portfolios")
    .select("username, user_id")
    .eq("username", username)
    .maybeSingle();

  const { data: existing, error } = await query;

  if (error) {
    return NextResponse.json(
      { available: false, username, error: error.message, suggestions: [] },
      { status: 500 },
    );
  }

  const takenByOther =
    existing && (!excludeUserId || existing.user_id !== excludeUserId);

  if (!takenByOther) {
    return NextResponse.json({
      available: true,
      username,
      error: null,
      suggestions: [],
    });
  }

  // Collect nearby taken names for suggestion filtering
  const { data: nearby } = await supabase
    .from("portfolios")
    .select("username")
    .ilike("username", `${username}%`)
    .limit(50);

  const taken = new Set((nearby ?? []).map((r) => r.username as string));
  taken.add(username);

  const suggestions = generateSuggestions(username, taken);

  return NextResponse.json({
    available: false,
    username,
    error: "Username already taken",
    suggestions,
  });
}
