import type { Figure } from './types';

/**
 * Figure di Hamacher uscite negli appelli recenti come «completa lo schema».
 * L'app non riproduce le tavole: rimanda al testo e dice cosa saper disegnare.
 */
export const figures: Figure[] = [
  { id: 'fig-5-8', code: 'fig. 5.8', desc: 'Datapath di un processore' },
  { id: 'fig-5-24', diagramId: 'processore-3bus', code: 'fig. 5.24', desc: 'Processore CISC a 3 bus' },
  { id: 'fig-6-2', diagramId: 'pipeline-5-stadi', code: 'fig. 6.2', desc: 'Percorso dati · pipeline a 5 stadi' },
  { id: 'fig-8-7', code: 'fig. 8.7', desc: 'Chip DRAM 32M × 8' },
  { id: 'fig-8-8', code: 'fig. 8.8', desc: 'DRAM sincrona' },
  { id: 'fig-8-16', code: 'fig. 8.16', desc: 'Cache · mappatura diretta' },
  { id: 'fig-8-17', code: 'fig. 8.17', desc: 'Cache · mappatura associativa' },
  { id: 'fig-8-18', diagramId: 'cache-set-associativa', code: 'fig. 8.18', desc: 'Cache · mappatura set-associativa' },
  { id: 'fig-8-26', diagramId: 'memoria-virtuale-tlb', code: 'fig. 8.26', desc: 'Traduzione indirizzi via TLB' },
  { id: 'fig-1-1', diagramId: 'unita-funzionali', code: 'fig. 1.1', desc: 'Unità funzionali di un calcolatore' },
  { id: 'fig-8-14', diagramId: 'gerarchia-memoria', code: 'fig. 8.14', desc: 'Gerarchia di memoria' },
  { id: 'fig-3-2', diagramId: 'interfaccia-io', code: 'fig. 3.2', desc: 'Connessione fra processore e periferiche' },
  { id: 'fig-9-2', diagramId: 'sommatore-ripple', code: 'fig. 9.2', desc: 'Sommatore a propagazione di riporto' },
];
