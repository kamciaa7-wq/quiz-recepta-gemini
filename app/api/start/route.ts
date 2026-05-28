import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { START_AT, END_AT } from '../../../lib/quiz';

export async function POST(req: Request) {
  const now = new Date();
  if (now < START_AT) return NextResponse.json({ error: 'Konkurs jeszcze się nie rozpoczął.' }, { status: 400 });
  if (now > END_AT) return NextResponse.json({ error: 'Konkurs został zakończony.' }, { status: 400 });
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const first_name = String(body.first_name || '').trim();
  const last_name = String(body.last_name || '').trim();
  if (!email || !first_name || !last_name) return NextResponse.json({ error: 'Brakuje danych.' }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: exists } = await sb.from('quiz_attempts').select('id').eq('email', email).maybeSingle();
  if (exists) return NextResponse.json({ error: 'Ten email został już użyty w konkursie.' }, { status: 409 });
  const { data, error } = await sb.from('quiz_attempts').insert({ first_name, last_name, email }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
