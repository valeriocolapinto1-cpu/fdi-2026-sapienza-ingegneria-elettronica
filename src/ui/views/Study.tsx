import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { topics, topicById, trapsForTopic } from '~/content';
import type { Topic } from '~/content/types';
import { hrefFor, navigate } from '~/lib/router';
import { markStudied, useProgress } from '~/store/progress';
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
      <div class="ref">{topic.ref}</div>
    </a>
  );
}

function TopicDetail({ topic }: { topic: Topic }): JSX.Element {
  // Segna il modulo come letto appena viene aperto.
  useEffect(() => markStudied(topic.id), [topic.id]);

  const linked = trapsForTopic(topic);

  return (
    <>
      <div class="detail-head" style="margin-top:6px">
        <div>
          <p class="eyebrow">{topic.ref}</p>
          <h1 class="h" style="font-size:28px">
            {topic.title}
          </h1>
        </div>
        <a class="btn ghost mini" href={hrefFor('study')}>
          ← Tutti i moduli
        </a>
      </div>

      <div class="panel prose" style="margin-top:14px">
        <Rich html={topic.body} />
        {linked.map((trap) => (
          <TrapNote key={trap.id} trap={trap} />
        ))}
      </div>

      <div class="btn-row">
        <button
          type="button"
          class="btn primary"
          onClick={() => navigate('exam', 'quick')}
        >
          Mettiti alla prova ▶
        </button>
      </div>
    </>
  );
}

export function Study({ topicId }: { topicId: string | null }): JSX.Element {
  const topic = topicId ? topicById(topicId) : undefined;

  if (topic) {
    return (
      <section class="view">
        <TopicDetail topic={topic} />
      </section>
    );
  }

  return (
    <section class="view">
      <p class="eyebrow">Moduli di studio</p>
      <h1 class="h">La teoria, per come la chiede all'esame</h1>
      <p class="lead">
        Sintesi operative con i riferimenti a Hamacher e le «trappole» segnalate dagli studenti.
        Tocca una scheda per approfondire.
      </p>
      <div class="cards" style="margin-top:20px">
        {topics.map((item, index) => (
          <TopicCard key={item.id} topic={item} index={index} />
        ))}
      </div>
    </section>
  );
}
