export const QUIZ_TITLE = 'Test wiedzy o Recepcie Gemini';

export const START_AT = new Date('2025-06-12T09:00:00+02:00');

export const END_AT = new Date('2025-06-12T14:00:00+02:00');

export const questions = [

  {
    id:'q1',
    text:'Jaki jest czas na przygotowanie rezerwacji złożonej przez Użytkownika?',
    answers:[
      {id:'a',text:'jeden dzień'},
      {id:'b',text:'dwa dni'},
      {id:'c',text:'cztery dni'}
    ],
    correct:'b'
  },

  {
    id:'q2',
    text:'Jaki maksymalny czas na odbiór rezerwacji przez Użytkownika?',
    answers:[
      {id:'a',text:'dwa dni'},
      {id:'b',text:'trzy dni'},
      {id:'c',text:'cztery dni'}
    ],
    correct:'c'
  },

  {
    id:'q3',
    text:'Czy do kolejki Kamsoftu zapisują się rezerwowane psychotropy?',
    answers:[
      {id:'a',text:'tak'},
      {id:'b',text:'nie'}
    ],
    correct:'b'
  },

  {
    id:'q4',
    text:'W jakim formacie w kolejce Kamsoftu zapisują się rezerwacje z Recepty Gemini?',
    answers:[
      {id:'a',text:'GEM-XXXXXXX'},
      {id:'b',text:'RG-XXXXXXX'},
      {id:'c',text:'GPL-XXXXXXX'}
    ],
    correct:'a'
  },

  {
    id:'q5',
    text:'Jakie leki są prezentowane na stronie Recepta Gemini?',
    answers:[
      {id:'a',text:'Tylko RX'},
      {id:'b',text:'Tylko OTC'},
      {id:'c',text:'OTC i RX'}
    ],
    correct:'a'
  },

  {
    id:'q6',
    text:'Jak są prezentowane ceny w Recepcie Gemini?',
    answers:[
      {id:'a',text:'Nie są prezentowane'},
      {id:'b',text:'Ceny są ustalane na podstawie średniej aptek '},
      {id:'c',text:'Ceny są ustalane na podstawie konkurencji internetowej'}
    ],
    correct:'c'
  },

  {
    id:'q7',
    text:'Jaki jest cel prezentowania cen leków na stronie?',
    answers:[
      {id:'a',text:'Dzięki temu wychodzimy do Pacjentów szukających leków onilne'},
      {id:'b',text:'Bo konkurecja tak ma'}
    ],
    correct:'a'
  },

  {
    id:'q8',
    text:'Jak zareagować kiedy nie jesteśmy w stanie zrealizować rezerwacji',
    answers:[
      {id:'a',text:'Nie reagować, nie potwierdzać rezerwacji czekać aż anuluje się sama po dwóch dniach'},
      {id:'b',text:'Anulować rezerwacje, wysłać wiadomość skontaktować się z Pacjentem proponując rozwiązanie'}
      
    ],
    correct:'b'
  }

];

export function scoreAnswers(
  answers: Record<string,string>
) {
  return questions.reduce(
    (sum, q) =>
      sum + (
        answers[q.id] === q.correct
          ? 1
          : 0
      ),
    0
  );
}
