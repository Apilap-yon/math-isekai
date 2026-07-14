import React, { useEffect, useState } from 'react';

interface Props {
  emoji: string;
  text: string;
  btnLabel: string;
  onNext: () => void;
}

export default function SceneScreen({ emoji, text, btnLabel, onNext }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div className={`screen scene-screen fade-in ${visible ? 'visible' : ''}`}>
      <div className="scene-content">
        <div className="scene-emoji float">{emoji}</div>
        <p className="scene-text">{text}</p>
        <button className="btn-primary" onClick={onNext}>{btnLabel}</button>
      </div>
    </div>
  );
}
