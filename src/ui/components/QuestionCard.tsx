import type { JSX } from 'preact';
import { fmtPoints } from '~/lib/i18n';
import type { Answer, Question, QuestionResult, SelfGrade } from '~/engine/types';
import { AsmBlock } from './AsmBlock';
import { Rich } from './Rich';
import { TruthTable } from './TruthTable';

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

/** Disegna il dato allegato al quesito: tabella, mappa o listato. */
function Payload({ question }: { question: Question }): JSX.Element | null {
  const payload = question.payload;
  if (!payload) return null;

  switch (payload.type) {
    case 'truthTable':
      return (
        <TruthTable
          vars={payload.vars}
          rows={payload.rows}
          caption="Tabella di verità del quesito"
        />
      );
    case 'kmap':
      return (
        <TruthTable
          vars={payload.vars}
          rows={payload.rows}
          caption={`Tabella di verità di Y(${payload.vars.join(',')})${
            payload.dontCares.length ? ' — x = indifferenza' : ''
          }`}
        />
      );
    case 'asm':
      return <AsmBlock lines={payload.lines} />;
  }
}

interface Props {
  question: Question;
  index: number;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  /** Presente dopo la correzione: blocca gli input e mostra l'esito. */
  result?: QuestionResult;
  /** La soluzione modello è stata rivelata (quesiti `self`). */
  revealed: boolean;
  onReveal: () => void;
}

export function QuestionCard({
  question,
  index,
  answer,
  onAnswer,
  result,
  revealed,
  onReveal,
}: Props): JSX.Element {
  const locked = result !== undefined;

  return (
    <div class="q">
      <div class="q-top">
        <span class="q-num">{String(index + 1).padStart(2, '0')}</span>
        <span class="q-cat">{question.cat}</span>
        <span class="cite">{question.ref}</span>
        <span class="q-pts">{fmtPoints(question.points)} pt</span>
      </div>

      <Rich class="q-body" html={question.q} />
      <Payload question={question} />

      {question.kind === 'mc' && (
        <div class="choices" role="radiogroup" aria-label={`Quesito ${index + 1}`}>
          {question.options.map((option, position) => {
            const selected = answer?.kind === 'mc' && answer.choice === position;
            const isCorrect = locked && position === question.correct;
            const isWrong = locked && selected && position !== question.correct;

            return (
              <label
                key={option}
                class={[
                  'choice',
                  selected ? 'sel' : '',
                  isCorrect ? 'correct' : '',
                  isWrong ? 'wrong' : '',
                  locked ? 'locked' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={selected}
                  disabled={locked}
                  onChange={() => onAnswer({ kind: 'mc', choice: position })}
                />
                <span class="k" aria-hidden="true">
                  {LETTERS[position]}
                </span>
                <Rich as="span" html={option} />
              </label>
            );
          })}
        </div>
      )}

      {question.kind === 'fill' && (
        <input
          class={`fill${
            locked ? (result?.outcome === 'correct' ? ' ok' : ' ko') : ''
          }`}
          type="text"
          inputMode={question.normalize === 'bin' ? 'numeric' : 'text'}
          autocomplete="off"
          spellcheck={false}
          placeholder={question.placeholder ?? ''}
          aria-label={`Risposta al quesito ${index + 1}`}
          disabled={locked}
          value={answer?.kind === 'fill' ? answer.text : ''}
          onInput={(event) =>
            onAnswer({ kind: 'fill', text: (event.target as HTMLInputElement).value })
          }
        />
      )}

      {question.kind === 'self' && !revealed && (
        <div class="selfgrade">
          <span class="sl">Rispondi su carta, poi:</span>
          <button type="button" class="btn ghost mini" onClick={onReveal}>
            Mostra soluzione modello
          </button>
        </div>
      )}

      {question.kind === 'self' && revealed && (
        <div class="reveal">
          <div class="rl">Soluzione modello</div>
          <Rich html={question.model} />
          <div class="selfgrade">
            <span class="sl" id={`sg-${question.id}`}>
              Come te la sei cavata?
            </span>
            {(
              [
                [1, '✓ Corretta'],
                [0.5, '≈ Parziale'],
                [0, '✗ No'],
              ] as [SelfGrade, string][]
            ).map(([grade, label]) => {
              const active = answer?.kind === 'self' && answer.grade === grade;
              return (
                <button
                  key={label}
                  type="button"
                  class="btn ghost mini"
                  aria-pressed={active}
                  disabled={locked}
                  style={active ? 'border-color:var(--color-copper);color:var(--color-copper)' : ''}
                  onClick={() => onAnswer({ kind: 'self', grade })}
                >
                  {label}
                </button>
              );
            })}
            {answer?.kind === 'self' && answer.grade !== null && (
              <span class={`verdict ${answer.grade > 0 ? 'ok' : 'no'}`}>
                {answer.grade === 1 ? '+pieno' : answer.grade === 0.5 ? '+metà' : '0 pt'}
              </span>
            )}
          </div>
        </div>
      )}

      {locked && question.kind !== 'self' && (
        <div class="reveal">
          <div class={`rl${result.outcome === 'correct' ? '' : ' ko'}`}>
            {result.outcome === 'correct'
              ? 'Corretta'
              : result.outcome === 'blank'
                ? 'Non risposta'
                : 'Da rivedere'}
          </div>
          {question.kind === 'fill' && (
            <p style="margin:0 0 6px">
              Risposta attesa: <span class="mono">{question.answer}</span>
            </p>
          )}
          {question.hint && (
            <div style="color:var(--color-muted);font-size:13px">
              <Rich as="span" html={question.hint} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
