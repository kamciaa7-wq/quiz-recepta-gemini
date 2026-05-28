import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPublic = url.searchParams.get('public') === '1';

  if (
    !isPublic &&
    req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: 'Brak dostępu.' },
      { status: 401 }
    );
  }

  const sb = supabaseAdmin();

  const select = isPublic
    ? 'id,first_name,last_name,score,duration_ms,finished_at'
    : '*';

  const { data, error } = await sb
    .from('quiz_attempts')
    .select(select)
    .eq('completed', true)
    .order('score', { ascending: false })
    .order('duration_ms', { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const rows = (data ?? []) as any[];

  return NextResponse.json({
    results: isPublic
      ? rows.filter((r: any) => r.score === 4).slice(0, 10)
      : rows
  });
}
