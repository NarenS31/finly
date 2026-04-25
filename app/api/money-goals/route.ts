import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("money_goals")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ goals: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    title: string;
    target_amount: number;
    currency_code?: string;
    target_date?: string;
  };

  const { data, error } = await supabase
    .from("money_goals")
    .insert({ ...body, user_id: auth.user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ goal: data });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { id: string; saved_amount?: number; completed?: boolean };

  const { data, error } = await supabase
    .from("money_goals")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .eq("user_id", auth.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ goal: data });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = (await req.json()) as { id: string };
  const { count, error } = await supabase
    .from("money_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select()
    .then((res) => ({ count: res.data?.length ?? 0, error: res.error }));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!count) return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
