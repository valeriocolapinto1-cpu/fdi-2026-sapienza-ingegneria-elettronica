import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { topics, topicById, trapsForTopic, TOPIC_GROUPS } from '~/content';
import { anchored, outline, readingMinutes } from '~/content/outline';
import { diagramById } from '~/content/diagrams';
import type { Topic, TopicCheck } from '~/content/types';
import { hrefFor, navigate } from '~/lib/router';
import { markStudied, useProgress } from '~/store/progress';
import { DiagramFigure } from '~/ui/components/DiagramFigure';
import { Rich } from '~/ui/components/Rich';
import { TrapNote } from '~/ui/components/TrapNote';

export function TopicCard({ topic, index }: { topic: Topic; index: number }): JSX.Element {
  const progress = useProgress();
  const visited = progress.studied.includes(topic.id);

  return (
    <a class="card" href={hrefFor('study', topic.id)}>
      <span class="bar" aria-hidden="true" />
      <div class="idx">
        MOD {String(index + 1).padStart(2, '0')}
        {visited && ' · letto'}
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.blurb}</p>
      <div class="ref">
        {topic.ref} · {readingMinutes(topic.body)} min
      </div>
    </a>
  );
}

/** Domanda di autoverifica: la risposta resta nascosta finché non ci provi. */
function CheckItem({ check, index }: { check: TopicCheck; index: number }): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <li class="chk">
      <p class="chk-q">
        <span class="chk-n">{index + 1}</span> {check.q}
      </p>
      <button type="button" class="btn ghost mini" onClick={() => setOpen((on) => !on)}>
        {open ? 'Nascondi la risposta' : 'Mostra la risposta'}
      </button>
      {open && <Rich class="chk-a" html={check.a} />}
    </li>
  );
}

function TopicDetail({ topic }: { topic: Topic }): JSX.Element {
  // Segna il modulo come letto appena viene aperto.
  useEffect(() => markStudied(topic.id), [topic.id]);

  const linked = trapsForTopic(topic);
  const sections = outline(topic.body);
  const position = topics.findIndex((item) => item.id === topic.id);
  const previous = position > 0 ? topics[position - 1] : undefined;
  const next = position < topics.length - 1 ? topics[position + 1] : undefined;
  const prerequisites = (topic.prereq ?? [])
    .map((id) => topicById(id))
    .filter((item): item is Topic => item !== undefined);
  const diagrams = (topic.diagramIds ?? [])
    .map((id) => diagramById(id))
    .filter((diagram) => diagram !== undefined);

  return (
    <>
      <div class="detail-head" style="margin-top:6px">
        <div>
          <p class="eyebrow">
            Modulo {position + 1} di {topics.length} · {topic.ref} ·{' '}
            {readingMinutes(topic.body)} min
          </p>
          <h1 class="h" style="font-size:28px">
            {topic.title}
          </h1>
        </div>
        <a class="btn ghost mini" href={hrefFor('study')}>
          ← Tutti i moduli
        </a>
      </div>

      {prerequisites.length > 0 && (
        <p class="fn" style="margin-top:8px">
          Prima di questo conviene aver letto:{' '}
          {prerequisites.map((item, index) => (
            <span key={item.id}>
              {index > 0 && ' · '}
              <a href={hrefFor('study', item.id)}>{item.title}</a>
            </span>
          ))}
        </p>
      )}

      <div class="recap">
        <h2>In due minuti</h2>
        <ul>
          {topic.summary.map((line, index) => (
            <li key={index}>
              <Rich as="span" html={line} />
            </li>
          ))}
        </ul>
        <p class="recap-note">
          Se il giorno prima dell'esame leggi solo questo riquadro, hai già in mano l'essenziale.
        </p>
      </div>

      {sections.length >= 4 && (
        <nav class="toc" aria-label={`Indice di ${topic.title}`}>
          <p class="toc-t">In questo modulo</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#/study/${topic.id}`} onClick={(event) => {
                  // Il router vive nell'hash, quindi un `href="#ancora"`
                  // cambierebbe rotta invece di scorrere: si scorre a mano.
                  event.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({ block: 'start' });
                }}>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div class="panel prose" style="margin-top:14px">
        <Rich html={anchored(topic.body)} />
        {linked.map((trap) => (
          <TrapNote key={trap.id} trap={trap} />
        ))}
      </div>

      {diagrams.length > 0 && (
        <>
          <h2 class="sec">Schemi di questo modulo</h2>
          <p class="lead">
            Studiali finché li rifai a memoria: all'esame uno schema da completare c'è sempre.
          </p>
          {diagrams.map((diagram) => (
            <div key={diagram.id} style="margin-bottom:22px">
              <DiagramFigure diagram={diagram} />
              <a class="btn ghost mini" href={hrefFor('train', diagram.id)}>
                Esercitati a completarlo ▶
              </a>
            </div>
          ))}
        </>
      )}

      <h2 class="sec">Autoverifica</h2>
      <p class="lead">
        Rispondi <b>prima</b> di scoprire la soluzione: riconoscere una risposta giusta è facile,
        produrla è un'altra cosa — ed è quella che serve sul foglio.
      </p>
      <ol class="checks">
        {topic.checks.map((check, index) => (
          <CheckItem key={index} check={check} index={index} />
        ))}
      </ol>

      <div class="btn-row">
        <button type="button" class="btn primary" onClick={() => navigate('exam', 'quick')}>
          Mettiti alla prova ▶
        </button>
        <a class="btn ghost" href={hrefFor('def')}>
          Definizioni
        </a>
      </div>

      <nav class="pager" aria-label="Moduli vicini">
        {previous ? (
          <a class="pg" href={hrefFor('study', previous.id)}>
            <span class="pg-l">← Precedente</span>
            <span class="pg-t">{previous.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a class="pg next" href={hrefFor('study', next.id)}>
            <span class="pg-l">Successivo →</span>
            <span class="pg-t">{next.title}</span>
          </a>
        )}
      </nav>
    </>
  );
}

export function Study({ topicId }: { topicId: string | null }): JSX.Element {
  const topic = topicId ? topicById(topicId) : undefined;
  const progress = useProgress();

  if (topic) {
    return (
      <section class="view">
        <TopicDetail topic={topic} />
      </section>
    );
  }

  const read = topics.filter((item) => progress.studied.includes(item.id)).length;
  const totalMinutes = topics.reduce((sum, item) => sum + readingMinutes(item.body), 0);

  return (
    <section class="view">
      <p class="eyebrow">Moduli di studio</p>
      <h1 class="h">La teoria, per come la chiede all'esame</h1>
      <p class="lead">
        Diciassette moduli in ordine di studio, dal binario alle prestazioni: ognuno con il
        ripasso «in due minuti», la teoria distesa e le domande per verificare da solo se hai
        capito. In tutto circa {totalMinutes} minuti di lettura — {read} moduli già aperti.
      </p>

      {TOPIC_GROUPS.map((group) => (
        <div key={group.id}>
          <h2 class="sec">{group.title}</h2>
          <p class="lead">{group.note}</p>
          <div class="cards" style="margin-top:14px">
            {group.topicIds.map((id) => {
              const item = topicById(id);
              if (!item) return null;
              return (
                <TopicCard
                  key={id}
                  topic={item}
                  index={topics.findIndex((entry) => entry.id === id)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
