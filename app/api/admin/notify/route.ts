
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { Resend } from 'resend';

function fmt(ms:number){

  const s = Math.floor((ms || 0) / 1000);

  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

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

  if (!process.env.RESEND_API_KEY) {

    return NextResponse.json(
      { error: 'Brak RESEND_API_KEY' },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from('quiz_attempts')
    .select('*')
    .eq('completed', true)
    .order('score', { ascending: false })
    .order('duration_ms', { ascending: true })
    .limit(3);

  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const resend = new Resend(
    process.env.RESEND_API_KEY
  );

  let sent = 0;

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
          Gratulacje! Jesteś w gronie
          <b>TOP 3</b> w konkursie
          <b>Test wiedzy o Recepcie Gemini</b>.
        </p>

        <p>
          Twój wynik:
          <b>${r.score}</b>
        </p>

        <p>
          Twój czas:
          <b>${fmt(r.duration_ms)}</b>
        </p>

        <p>
          Podejdź do nas po nagrodę :).
        </p>

        <p>
          Pozdrawiamy<br/>
          Zespół Recepta Gemini
        </p>
      `
    });

    console.log(result);

    if (result.error) {

      return NextResponse.json({
        error: JSON.stringify(result.error)
      });
    }

    sent++;

    await sb
      .from('quiz_attempts')
      .update({ notified: true })
      .eq('id', r.id);
  }

  return NextResponse.json({
    sent
  });
}

