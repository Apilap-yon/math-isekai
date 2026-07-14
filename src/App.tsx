import React, { useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { useAudio } from './hooks/useAudio';
import IntroScreen from './components/IntroScreen';
import SceneScreen from './components/SceneScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import MuteButton from './components/MuteButton';
import { QUESTIONS, OUTRO_TEXT } from './data/quiz';
import './App.css';

export default function App() {
  const { state, start, nextIntroScene, startQuiz, answer, showResult, restart, getSortedScores } = useQuiz();
  const { playBgm, playSfx, toggleMute, unlockAudio, muted } = useAudio();

  // เปลี่ยน BGM ตาม phase
  useEffect(() => {
    if (state.phase === 'intro' || state.phase === 'scene1' || state.phase === 'scene2') {
      playBgm('intro');
    } else if (state.phase === 'quiz' || state.phase === 'outro') {
      playBgm('quiz');
    } else if (state.phase === 'result') {
      playBgm('result');
      playSfx('fanfare');
    }
  }, [state.phase, playBgm, playSfx]);

  // Unlock audio + เริ่มเกม
  const handleStart = () => {
    unlockAudio();
    start();
  };

  const handleAnswer = (choice: Parameters<typeof answer>[0]) => {
    playSfx('select');
    answer(choice);
  };

  const handleNextScene = (next: () => void) => () => {
    playSfx('correct');
    next();
  };

  const handleRestart = () => {
    unlockAudio();
    restart();
  };

  return (
    <div className="app-container">
      <MuteButton muted={muted} onToggle={toggleMute} />

      {state.phase === 'intro' && <IntroScreen onStart={handleStart} />}

      {state.phase === 'scene1' && (
        <SceneScreen
          emoji="😴"
          text={'เสียงครูสอนดังแว่วมาเบาๆ เหมือนเสียงกล่อมนอน...\nเปลือกตาคุณหนักขึ้นเรื่อยๆ'}
          btnLabel="หลับตา..."
          onNext={handleNextScene(nextIntroScene)}
        />
      )}

      {state.phase === 'scene2' && (
        <SceneScreen
          emoji="⚡"
          text={'จู่ๆ แสงสว่างวาบขึ้นทั่วห้อง!\nคุณถูกดูดเข้าสู่มิติแห่งคณิตศาสตร์...'}
          btnLabel="⚔️ พร้อมแล้ว!"
          onNext={handleNextScene(startQuiz)}
        />
      )}

      {state.phase === 'quiz' && (
        <QuizScreen
          key={state.currentQ}
          question={QUESTIONS[state.currentQ]}
          current={state.currentQ}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      )}

      {state.phase === 'outro' && (
        <SceneScreen
          emoji="🌟"
          text={OUTRO_TEXT}
          btnLabel="เปิดเผยตัวตน!"
          onNext={handleNextScene(showResult)}
        />
      )}

      {state.phase === 'result' && (
        <ResultScreen sorted={getSortedScores()} onRestart={handleRestart} />
      )}
    </div>
  );
}
