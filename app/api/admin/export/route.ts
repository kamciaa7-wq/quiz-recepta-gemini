import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Brak dostępu.' }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('quiz_attempts').select('*').order('score', { ascending: false }).order('duration_ms', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data||[]).map((r:any, i:number)=>({miejsce:i+1, imie:r.first_name, nazwisko:r.last_name, email:r.email, wynik:r.score, czas_ms:r.duration_ms, czas_s: r.duration_ms ? Math.round(r.duration_ms/1000) : '', zakonczono:r.finished_at, powiadomiony:r.notified?'TAK':'NIE'}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'wyniki');
  const buf = XLSX.write(wb, { type:'buffer', bookType:'xlsx' });
  return new NextResponse(buf, { headers: { 'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition':'attachment; filename="wyniki_quizu_rg.xlsx"' }});
}
