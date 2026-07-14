import React, { useEffect, useState } from 'react';
import { Question, Choice } from '../data/quiz';

interface Props {
  question: Question;
  current: number;
  total: number;
  onAnswer: (choice: Choice) => void;
}

export default function QuizScreen({ question, current, total, onAnswer }: Props) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setVisible(false);
    setSelected(null);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [question.id]);

  const handleSelect = (idx: number, choice: Choice) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onAnswer(choice), 600);
  };

  const progress = (current / total) * 100;
  const isTiebreaker = question.choices.length > 4;

  return (
    <div className={`screen quiz-screen fade-in ${visible ? 'visible' : ''}`}>
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-label">ชั้น {current + 1} / {total}</span>
      </div>

      <div className="quiz-card">
        <p className="question-scene">{question.scene}</p>
        <h2 className="question-prompt">{question.prompt}</h2>

        {isTiebreaker && (
          <p className="tiebreaker-hint">✦ เลือกได้เพียง 1 คุณสมบัติ ✦</p>
        )}

        <div className={isTiebreaker ? 'choices choices--grid' : 'choices'}>
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              className={`choice-btn ${isTiebreaker ? 'choice-btn--compact' : ''} ${selected === idx ? 'selected' : ''} ${selected !== null && selected !== idx ? 'dimmed' : ''}`}
              onClick={() => handleSelect(idx, choice)}
            >
              {!isTiebreaker && (
                <span className="choice-letter">{String.fromCharCode(65 + idx)}</span>
              )}
              <span className="choice-text">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
