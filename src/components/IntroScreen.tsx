import React, { useEffect, useState } from 'react';

interface Props {
  onStart: () => void;
}

const ARCHETYPES = [
  { icon: '⚔️', name: 'Hero' },
  { icon: '🧠', name: 'Sage' },
  { icon: '✨', name: 'Mage' },
  { icon: '🎯', name: 'Rogue' },
  { icon: '🛡️', name: 'Knight' },
  { icon: '💝', name: 'Priestess' },
  { icon: '🎨', name: 'Bard' },
  { icon: '🔍', name: 'Seeker' },
];

export default function IntroScreen({ onStart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`screen intro-screen fade-in ${visible ? 'visible' : ''}`}>
      <div className="intro-hero">

        {/* Orbit ring */}
        <div className="orbit-container">
          <div className="orbit-ring">
            {ARCHETYPES.map((a, i) => {
              const angle = (i / ARCHETYPES.length) * 360;
              return (
                <div
                  key={a.name}
                  className="orbit-item"
                  style={{ '--start': `${angle}deg` } as React.CSSProperties}
                >
                  <span className="orbit-icon">{a.icon}</span>
                  <span className="orbit-name">{a.name}</span>
                </div>
              );
            })}
          </div>
          <img src="/logo-mathweek.png" alt="Math Week 2026" className="intro-logo" />
        </div>

        <p className="title-sub">ผู้ถูกเรียกข้ามโลก</p>
        <div className="title-divider">✦ ✦ ✦</div>
        <p className="intro-desc">
          ค้นพบว่าคุณคือ<strong>นักคณิตศาสตร์ประเภทใด</strong><br />
          ใน 10 ชั้นแห่งหอคอยแห่งความรู้
        </p>
        <button className="btn-primary pulse" onClick={onStart}>
          ⚔️ เริ่มการผจญภัย
        </button>
      </div>
    </div>
  );
}
