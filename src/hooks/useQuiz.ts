import { useState } from 'react';
import { QUESTIONS, ArchetypeKey, Choice } from '../data/quiz';

export type Phase = 'intro' | 'scene1' | 'scene2' | 'quiz' | 'outro' | 'result';

export interface QuizState {
  phase: Phase;
  introStep: number;
  currentQ: number;
  scores: Record<ArchetypeKey, number>;
}

const ARCHETYPES: ArchetypeKey[] = ['Hero', 'Sage', 'Mage', 'Rogue', 'Knight', 'Priestess', 'Bard', 'Seeker'];

function initScores(): Record<ArchetypeKey, number> {
  return Object.fromEntries(ARCHETYPES.map(k => [k, 0])) as Record<ArchetypeKey, number>;
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    phase: 'intro',
    introStep: 0,
    currentQ: 0,
    scores: initScores(),
  });

  const start = () => setState(s => ({ ...s, phase: 'scene1' }));

  const nextIntroScene = () => setState(s => ({ ...s, phase: 'scene2' }));

  const startQuiz = () => setState(s => ({ ...s, phase: 'quiz', currentQ: 0 }));

  const answer = (choice: Choice) => {
    const newScores = { ...state.scores };
    const pts = choice.points ?? 4;
    choice.scores.forEach(k => { newScores[k] = (newScores[k] || 0) + pts; });

    if (state.currentQ >= QUESTIONS.length - 1) {
      setState(s => ({ ...s, scores: newScores, phase: 'outro' }));
    } else {
      setState(s => ({ ...s, scores: newScores, currentQ: s.currentQ + 1 }));
    }
  };

  const showResult = () => setState(s => ({ ...s, phase: 'result' }));

  const restart = () => setState({ phase: 'intro', introStep: 0, currentQ: 0, scores: initScores() });

  const getSortedScores = () => {
    return ARCHETYPES
      .map(k => ({ key: k, score: state.scores[k] }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return Math.random() - 0.5; // random shuffle on tie
      });
  };

  return { state, start, nextIntroScene, startQuiz, answer, showResult, restart, getSortedScores };

}
