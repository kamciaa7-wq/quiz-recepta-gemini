import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { Resend } from 'resend';

export async function POST(req: Request) {
  if (
    req.headers.get('x-admin-password') !==
    process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: 'Brak dostępu.' },
      { status: 401 }
    );
  }

  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'BRAK KLUCZA RESEND' },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from('quiz_attempts')
    .select('*')
    .eq('completed', true)
    .eq('score', 4)
    .order('duration_ms', { ascending: true })
    .limit(3);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const r of data || []) {
    const result = await resend.emails.send({
      from:
        process.env.WINNERS_EMAIL_FROM ||
        'Konkurs <onboarding@resend.dev>',
      to: r.email,
      subject:
        'Wyniki konkursu – Test wiedzy o Recepcie Gemini',
      html: `
        <p>Dzień dobry ${r.first_name},</p>

        <p>
          Gratulacje! Jesteś w gronie 3 najlepszych osób
          w konkursie <b>Test wiedzy o Recepcie Gemini</b>.
        </p>

        <p>
          Skontaktujemy się w sprawie nagrody.
        </p>

        <p>
          Pozdrawiamy<br/>
          Zespół Recepta Gemini
        </p>
      `
    });

    console.log(result);

    await sb
      .from('quiz_attempts')
      .update({ notified: true })
      .eq('id', r.id);
  }

  return NextResponse.json({
    sent: data?.length || 0
  });
}

