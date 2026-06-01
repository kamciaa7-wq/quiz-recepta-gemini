import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();

  const email = String(body.email || '').trim().toLowerCase();
  const first_name = String(body.first_name || '').trim();
  const last_name = String(body.last_name || '').trim();

  if (!email || !first_name || !last_name) {
    return NextResponse.json(
      { error: 'Uzupełnij wszystkie pola.' },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  const { data: exists } = await sb
    .from('quiz_attempts')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (exists) {
    return NextResponse.json(
      { error: 'Ten email został już użyty w konkursie.' },
      { status: 409 }
    );
  }

  const { data, error } = await sb
    .from('quiz_attempts')
    .insert({
      first_name,
      last_name,
      email,
      started_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) {
    if (
      error.message?.includes('duplicate key') ||
      error.message?.includes('quiz_attempts_email_key')
    ) {
      return NextResponse.json(
        { error: 'Ten email został już użyty w konkursie.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id });
}
