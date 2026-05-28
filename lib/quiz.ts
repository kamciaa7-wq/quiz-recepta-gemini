export const QUIZ_TITLE = 'Test wiedzy o Recepcie Gemini';
export const START_AT = new Date('2025-06-12T09:00:00+02:00');
export const END_AT = new Date('2025-06-12T14:00:00+02:00');

export const questions = [
  { id:'q1', text:'Jaki jest czas na przygotowanie rezerwacji złożonej przez Użytkownika?', answers:[{id:'a',text:'jeden dzień'},{id:'b',text:'dwa dni'},{id:'c',text:'cztery dni'}], correct:'b' },
  { id:'q2', text:'Jaki maksymalny czas na odbiór rezerwacji przez Użytkownika?', answers:[{id:'a',text:'dwa dni'},{id:'b',text:'trzy dni'},{id:'c',text:'cztery dni'}], correct:'c' },
  { id:'q3', text:'Czy do kolejki Kamsoftu zapisują się rezerwowane psychotropy?', answers:[{id:'a',text:'tak'},{id:'b',text:'nie'}], correct:'b' },
  { id:'q4', text:'W jakim formacie w kolejce Kamsoftu zapisują się rezerwacje z Recepty Gemini?', answers:[{id:'a',text:'GEM-XXXXXXX'},{id:'b',text:'RG-XXXXXXX'},{id:'c',text:'GPL-XXXXXXX'}], correct:'a' }
];

export function scoreAnswers(answers: Record<string,string>) {
  return questions.reduce((sum, q) => sum + (answers[q.id] === q.correct ? 1 : 0), 0);
}
