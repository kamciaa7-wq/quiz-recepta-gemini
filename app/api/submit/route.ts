import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { scoreAnswers } from '../../../lib/quiz';

export async function POST(req: Request) {
  const { id, answers } = await req.json();
  if (!id || !answers) return NextResponse.json({ error: 'Brakuje odpowiedzi.' }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: attempt, error: readError } = await sb.from('quiz_attempts').select('*').eq('id', id).single();
  if (readError || !attempt) return NextResponse.json({ error: 'Nie znaleziono próby.' }, { status: 404 });
  if (attempt.completed) return NextResponse.json({ error: 'Ten quiz został już zakończony.' }, { status: 409 });
  const finished = new Date();
  const duration_ms = Math.max(0, finished.getTime() - new Date(attempt.started_at).getTime());
  const score = scoreAnswers(answers);
  const { error } = await sb.from('quiz_attempts').update({ answers, score, duration_ms, finished_at: finished.toISOString(), completed: true }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ score, duration_ms });
}
