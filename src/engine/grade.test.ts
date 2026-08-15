import { describe, expect, it } from 'vitest';
import { buildExam } from './buildExam';
import { gradeExam, normalizeFill, verdictMessage } from './grade';
import type { Answer, Exam, SelfGrade } from './types';

/** Risposte tutte esatte, con l'autovalutazione al livello indicato. */
function answersFor(exam: Exam, selfGrade: SelfGrade = 1): Record<string, Answer> {
  const answers: Record<string, Answer> = {};
  for (const question of exam.questions) {
    if (question.kind === 'mc') answers[question.id] = { kind: 'mc', choice: question.correct };
    else if (question.kind === 'fill') {
      answers[question.id] = { kind: 'fill', text: question.answer };
    } else answers[question.id] = { kind: 'self', grade: selfGrade };
  }
  return answers;
}

describe('normalizzazione delle risposte brevi', () => {
  it('ignora spazi e separatori nel binario', () => {
    expect(normalizeFill(' 0110 ', 'bin')).toBe('0110');
    expect(normalizeFill('0110 1010', 'bin')).toBe('01101010');
    expect(normalizeFill('0110', 'bin')).toBe('0110');
  });

  it('accetta l’esadecimale minuscolo e il prefisso 0x', () => {
    expect(normalizeFill('1f', 'hex')).toBe('1F');
    expect(normalizeFill('0x1F', 'hex')).toBe('1F');
    expect(normalizeFill(' ff ', 'hex')).toBe('FF');
  });

  it('tiene il segno nei decimali', () => {
    expect(normalizeFill(' -128 ', 'dec')).toBe('-128');
  });
});

describe('correzione della prova completa', () => {
  it('30/30 e lode con tutto esatto', () => {
    const exam = buildExam('full', 11);
    const result = gradeExam(exam, answersFor(exam, 1));

    expect(result.earned).toBe(30);
    expect(result.score30).toBe(30);
    expect(result.lode).toBe(true);
    expect(verdictMessage(result)).toBe('Prova eccellente.');
  });

  it('niente lode se un quesito aperto è solo parziale', () => {
    const exam = buildExam('full', 11);
    const result = gradeExam(exam, answersFor(exam, 0.5));

    // I tre `self` valgono 5+4+3 = 12: a metà si perdono 6 punti.
    expect(result.earned).toBe(24);
    expect(result.score30).toBe(24);
    expect(result.lode).toBe(false);
  });

  it('senza risposte il punteggio è zero e i quesiti risultano in bianco', () => {
    const exam = buildExam('full', 3);
    const result = gradeExam(exam, {});

    expect(result.earned).toBe(0);
    expect(result.score30).toBe(0);
    expect(result.lode).toBe(false);
    expect(result.results.every((entry) => entry.outcome === 'blank')).toBe(true);
  });

  it('distingue una risposta sbagliata da una non data', () => {
    const exam = buildExam('binary', 5);
    const first = exam.questions[0];
    if (!first) throw new Error('prova vuota');

    const wrong = gradeExam(exam, { [first.id]: { kind: 'fill', text: 'xxxx' } });
    expect(wrong.results[0]?.outcome).toBe('wrong');

    const blank = gradeExam(exam, { [first.id]: { kind: 'fill', text: '   ' } });
    expect(blank.results[0]?.outcome).toBe('blank');
  });

  it('accetta la forma non normalizzata della risposta esatta', () => {
    const exam = buildExam('binary', 9);
    const answers: Record<string, Answer> = {};
    for (const question of exam.questions) {
      if (question.kind !== 'fill') continue;
      // Spazi in mezzo e in coda: devono essere ininfluenti.
      answers[question.id] = { kind: 'fill', text: ` ${question.answer.replace(/(.{2})/g, '$1 ')} ` };
    }
    const result = gradeExam(exam, answers);
    const fills = result.results.filter((entry) =>
      exam.questions.some((q) => q.id === entry.id && q.kind === 'fill'),
    );
    expect(fills.every((entry) => entry.outcome === 'correct')).toBe(true);
  });

  it('il voto in trentesimi esiste solo per la prova completa', () => {
    const quick = buildExam('quick', 4);
    const result = gradeExam(quick, answersFor(quick));

    expect(result.score30).toBeUndefined();
    expect(result.percent).toBe(100);
    expect(result.lode).toBe(false);
  });

  it('riporta la percentuale anche sulla prova completa', () => {
    const exam = buildExam('full', 2);
    const result = gradeExam(exam, answersFor(exam, 0));
    // I tre `self` a zero: restano 18 punti su 30.
    expect(result.earned).toBe(18);
    expect(result.percent).toBe(60);
    expect(verdictMessage(result)).toBe('Superato. Rifinisci i punti deboli.');
  });

  it('conserva il riferimento alla voce di banca, per la ripetizione dilazionata', () => {
    const exam = buildExam('full', 8);
    const result = gradeExam(exam, answersFor(exam));
    const withBank = result.results.filter((entry) => entry.bankId !== undefined);
    expect(withBank.length).toBeGreaterThan(0);
  });
});
