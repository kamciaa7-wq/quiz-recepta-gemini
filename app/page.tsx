
'use client';

 

import { useMemo, useState } from 'react';

import { QUIZ_TITLE, questions } from '../lib/quiz';

 

type Stage = 'home'|'form'|'quiz'|'done'|'ranking';

 

const fmt = (ms:number) => {

  const s = Math.floor(ms / 1000);

  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

};

 

const LOGO = '/Zrzut ekranu 2026-05-29 112620.png';

 

export default function Home(){

  const [stage,setStage] = useState<Stage>('home');

  const [form,setForm] = useState({first_name:'',last_name:'',email:''});

  const [attempt,setAttempt] = useState('');

  const [idx,setIdx] = useState(0);

  const [answers,setAnswers] = useState<Record<string,string>>({});

  const [result,setResult] = useState<any>(null);

  const [ranking,setRanking] = useState<any[]>([]);

  const [err,setErr] = useState('');

 

  const q = questions[idx];

  const selected = q ? answers[q.id] : '';

 

  async function start(){

    setErr('');

 

    if(!form.first_name || !form.last_name || !form.email){

      setErr('Uzupełnij wszystkie pola.');

      return;

    }

 

    const r = await fetch('/api/start',{

      method:'POST',

      headers:{'Content-Type':'application/json'},

      body:JSON.stringify(form)

    });

 

    const j = await r.json();

 

    if(!r.ok){

      setErr(j.error || 'Nie udało się rozpocząć quizu.');

      return;

    }

 

    setAttempt(j.id);

    setStage('quiz');

  }

 

  async function finish(){

    const r = await fetch('/api/submit',{

      method:'POST',

      headers:{'Content-Type':'application/json'},

      body:JSON.stringify({id:attempt,answers})

    });

 

    const j = await r.json();

 

    if(!r.ok){

      setErr(j.error || 'Nie udało się zapisać wyniku.');

      return;

    }

 

    setResult(j);

    setStage('done');

  }

 

  async function showRanking(){

    const r = await fetch('/api/admin/results?public=1');

    const j = await r.json();

 

    setRanking(j.results || []);

    setStage('ranking');

  }

 

  const content = useMemo(()=>{

 

    if(stage === 'home') return (

      <>

        <img className="logoImg" src={LOGO} alt="Recepta Gemini" />

 

        <div className="heroIcon">📘</div>

 

        <h1 className="titleSmall">

          Test wiedzy<br/>o Recepcie Gemini

        </h1>

 

        <p className="sub">

          Sprawdź swoją wiedzę<br/>i powalcz o nagrody!

        </p>

 

        <div className="infoCard">

          <div>📝 4 pytania</div>

          <div>⏱️ Najlepszy czas wygrywa</div>


        </div>

 

        <button className="btn" onClick={()=>setStage('form')}>

          Rozpocznij quiz

        </button>

 

        <div className="orangeWave"/>

      </>

    );

 

    if(stage === 'form') return (

      <>

        <img className="logoImg" src={LOGO} alt="Recepta Gemini" />

 

        <h1 className="h1">Zacznij quiz</h1>

 

        <p className="sub">

          Wypełnij formularz, aby rozpocząć.

        </p>

 

        {err && <div className="error">{err}</div>}

 

        <label className="label">Imię</label>

        <input className="input" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})}/>

 

        <label className="label">Nazwisko</label>

        <input className="input" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})}/>

 

        <label className="label">Email</label>

        <input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>

 

        <button className="btn" onClick={start}>

          Rozpocznij quiz

        </button>

 

        <div className="orangeWave"/>

      </>

    );

 

    if(stage === 'quiz') return (

      <>

        <img className="logoImg" src={LOGO} alt="Recepta Gemini" />

 

        <div className="quizTop">

          <span>Pytanie {idx + 1}/4</span>

          <span>{fmt((idx + 1) * 10000)}</span>

        </div>

 

        <div className="q">{q.text}</div>

 

        {q.answers.map(a=>(

          <button

            key={a.id}

            className={'answer ' + (selected === a.id ? 'active' : '')}

            onClick={()=>setAnswers({...answers,[q.id]:a.id})}

          >

            <span className="dot"/>

            <span><b>{a.id.toUpperCase()}.</b> {a.text}</span>

          </button>

        ))}

 

        {err && <div className="error">{err}</div>}

 

        <button

          className="btn"

          disabled={!selected}

          onClick={()=> idx < questions.length - 1 ? setIdx(idx + 1) : finish()}

        >

          {idx < questions.length - 1 ? 'Następne' : 'Zakończ quiz'}

        </button>

 

        <div className="orangeWave"/>

      </>

    );

 

    if(stage === 'done') return (

      <>

        <img className="logoImg" src={LOGO} alt="Recepta Gemini" />

 

        <div className="trophy">🏆</div>

 

        <h1 className="titleSmall">Twój wynik</h1>

 

        <p className="sub">

          Odpowiedziałaś poprawnie na<br/>

          <b>{result.score} z 4 pytań</b>

        </p>

 

        <div className="scoreBox">

          Twój czas: <b>{fmt(result.duration_ms)}</b>

        </div>

 

        <button className="btn" onClick={showRanking}>

          Zobacz ranking

        </button>

 

        <div className="orangeWave"/>

      </>

    );

 

    return (

      <>

        <img className="logoImg" src={LOGO} alt="Recepta Gemini" />

 

        <h1 className="titleSmall">Ranking</h1>

 

        <div className="rankingCard">

          <table className="rank">

            <thead>

              <tr>

                <th>#</th>

                <th>Imię i nazwisko</th>

                <th>Czas</th>

                <th>Wynik</th>

              </tr>

            </thead>

            <tbody>

              {ranking.map((r,i)=>(

                <tr key={r.id}>

                  <td>{i + 1}</td>

                  <td>{r.first_name} {r.last_name}</td>

                  <td>{fmt(r.duration_ms)}</td>

                  <td>{r.score}/4</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

 

        <button className="btn secondary" onClick={()=>setStage('home')}>

          Wróć

        </button>

      </>

    );

 

  },[stage,form,idx,answers,err,result,ranking]);

 

  return (

    <main className="wrap">

      <section className="phone">

        {content}

      </section>

    </main>

  );

}


