import React, { useRef, useState, useLayoutEffect } from 'react';
import html2canvas from 'html2canvas';
import { ArchetypeKey, ARCHETYPE_INFO } from '../data/quiz';

interface ScoreEntry {
  key: ArchetypeKey;
  score: number;
}

interface Props {
  sorted: ScoreEntry[];
  onRestart: () => void;
}

/* ─── ค่าคงที่ ─── */
const BAR_MAX = 20;
const CARD_W = 1080;
const CARD_H = 1920;
const BG_COLOR = '#F5F5DC';

/* พาเลตต์สีธีม parchment */
const C = {
  ink: '#5a4629',
  brownDeep: '#7a5530',
  brownMid: '#8a5f30',
  brownSoft: '#6b5233',
  gold: '#a9855a',
  goldLight: '#d8b87e',
  green: '#6f7d45',
  pairText: '#3d2a14',
  cream: 'rgba(255,252,245,0.7)',
  creamLite: 'rgba(255,252,245,0.35)',
  border: 'rgba(139,101,58,0.3)',
} as const;

const FONT_HEAD = "'Kanit', sans-serif";
const FONT_BODY = "'Sarabun', sans-serif";

/* พื้นหลัง parchment แบบ layered gradient (เหมือนไฟล์ดีไซน์) */
const cardBackground =
  'radial-gradient(ellipse 900px 700px at 50% 6%, #efe3cd 0%, transparent 60%),' +
  'radial-gradient(ellipse 800px 600px at 92% 28%, #e7d2ab55 0%, transparent 55%),' +
  'radial-gradient(ellipse 700px 900px at 4% 68%, #d8c19f55 0%, transparent 55%),' +
  'linear-gradient(180deg, #f6efe0 0%, #f0e4cc 22%, #e9d9b8 45%, #e3d1ac 68%, #d8c093 100%)';

/* การ์ดกระจก (trait card) */
const glassCard: React.CSSProperties = {
  borderRadius: 26,
  background: `linear-gradient(160deg, ${C.cream}, ${C.creamLite})`,
  border: `1px solid ${C.border}`,
  boxShadow: '0 16px 40px rgba(120,86,50,0.15)',
};

export default function ResultScreen({ sorted, onRestart }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScores, setShowScores] = useState(false);

  const top = sorted[0];
  const topInfo = ARCHETYPE_INFO[top.key];
  const bfInfo = ARCHETYPE_INFO[topInfo.bestFriend];
  const maxScore = top.score || 1;
  const imgSrc = `/archetypes/${top.key.toLowerCase()}.png`;
  const bfImgSrc = `/archetypes/${topInfo.bestFriend.toLowerCase()}.png`;

  /* ย่อการ์ด 1080px ให้พอดีความกว้างจอ */
  useLayoutEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      setScale(Math.min(1, wrapRef.current.clientWidth / CARD_W));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ─── บันทึกรูป PNG ขนาด 1080×1920 ─── */
  const saveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);

    try {
      // รอฟอนต์ + รูปภาพให้พร้อมก่อน export (กันข้อความ/รูปเพี้ยน)
      if (document.fonts?.ready) await document.fonts.ready;
      const images = Array.from(cardRef.current.querySelectorAll('img'));
      await Promise.all(
        images.map(img =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>(res => {
                img.onload = () => res();
                img.onerror = () => res();
              })
        )
      );

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: BG_COLOR,
        scale: 1,
        useCORS: true,
        logging: false,
        width: CARD_W,
        height: CARD_H,
      });

      const link = document.createElement('a');
      link.download = `math-isekai-${top.key.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกรูปภาพ:', error);
      alert('ไม่สามารถบันทึกรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  /**
   * เนื้อหาการ์ด 1080×1920 ใช้ทั้งบนจอ (forExport=false) และตอน export (forExport=true)
   * โหมดจอ: มี animation + เงา / โหมด export: ปิด animation + ตัดเงาการ์ด (ให้รูปสะอาด)
   */
  const renderCard = (forExport: boolean) => {
    const glass: React.CSSProperties = {
      ...glassCard,
      boxShadow: forExport ? 'none' : glassCard.boxShadow,
    };
    // ตัดเงาทั้งหมดตอน export (กันเงาเข้มรอบกล่อง/ป้ายในรูปที่ดาวน์โหลด)
    const shadow = (val: string) => (forExport ? 'none' : val);
    return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_BODY,
        background: cardBackground,
        boxSizing: 'border-box',
      }}
    >
      {/* ประกายดาวประดับ */}
      <span style={{ position: 'absolute', top: 150, left: 80, fontSize: 34, color: C.gold }}>✦</span>
      <span style={{ position: 'absolute', top: 260, right: 100, fontSize: 26, color: C.gold }}>✧</span>
      <span style={{ position: 'absolute', top: 960, left: 60, fontSize: 30, color: '#8a6640' }}>✦</span>
      <span style={{ position: 'absolute', top: 1020, right: 70, fontSize: 22, color: '#8a6640' }}>✧</span>
      <span style={{ position: 'absolute', top: 1730, left: 120, fontSize: 28, color: C.gold }}>✧</span>
      <span style={{ position: 'absolute', top: 1700, right: 130, fontSize: 24, color: C.gold }}>✦</span>

      {/* ── header badge ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(255,252,245,0.75), rgba(255,252,245,0.4))',
            border: '1.5px solid rgba(139,101,58,0.45)',
            boxShadow: shadow('0 8px 24px rgba(120,86,50,0.18)'),
          }}
        >
          <span style={{ fontSize: 30 }}>🗝️</span>
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 32, color: '#6b4a28', letterSpacing: 1 }}>
            ผลการพิชิตหอคอย
          </span>
          <span style={{ fontSize: 30 }}>✨</span>
        </div>
      </div>

      {/* ── ชื่อคลาส ── */}
      <div style={{ textAlign: 'center', marginTop: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <span style={{ fontSize: 58 }}>{topInfo.icon}</span>
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 92,
              color: C.brownDeep,
              letterSpacing: 1,
            }}
          >
            {topInfo.thaiName}
          </span>
        </div>
        <div
          style={{
            marginTop: 16,
            display: 'inline-block',
            padding: '7px 26px',
            borderRadius: 999,
            background: 'rgba(255,252,245,0.55)',
            border: '1px solid rgba(139,101,58,0.45)',
          }}
        >
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 28, letterSpacing: 8, color: C.brownDeep }}>
            {top.key.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── tagline ── */}
      <div style={{ textAlign: 'center', marginTop: 24, padding: '0 100px' }}>
        <span style={{ fontFamily: FONT_BODY, fontStyle: 'italic', fontSize: 27, color: C.brownSoft, lineHeight: 1.45 }}>
          {topInfo.desc}
        </span>
      </div>

      {/* ── portrait วงกลมเวทมนตร์ ── */}
      <div style={{ position: 'relative', width: 470, height: 470, margin: '30px auto 0' }}>
        <svg
          viewBox="0 0 380 380"
          className={forExport ? undefined : 'ring-spin'}
          style={{ position: 'absolute', inset: -24, width: 518, height: 518 }}
        >
          <circle cx="210" cy="210" r="194" fill="none" stroke="rgba(139,101,58,0.4)" strokeWidth="2" strokeDasharray="4 10" />
          <circle cx="210" cy="210" r="178" fill="none" stroke="rgba(169,124,70,0.3)" strokeWidth="1.5" />
        </svg>
        <div
          className={forExport ? undefined : 'portrait-glow'}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            padding: 7,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight}, #e9d9b8, ${C.gold})`,
            boxShadow: '0 0 50px 8px rgba(150,105,60,0.28), 0 0 0 8px rgba(255,255,255,0.35)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 42%, #f6efe0, #e3d1ac)',
            }}
          >
            <img
              src={imgSrc}
              alt={topInfo.thaiName}
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: '50% 55%', padding: 18, boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* ── divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '34px 100px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,101,58,0.45))' }} />
        <span style={{ fontSize: 22, color: C.gold }}>✦</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(139,101,58,0.45))' }} />
      </div>

      {/* ── ความโดดเด่น ── */}
      <div style={{ ...glass, margin: '26px 72px 0', padding: '26px 38px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>💪</span>
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, color: C.brownMid }}>ความโดดเด่น</span>
        </div>
        <div style={{ fontSize: 25, lineHeight: 1.55, color: C.ink }}>{topInfo.strengths}</div>
      </div>

      {/* ── พื้นที่พัฒนา ── */}
      <div style={{ ...glass, margin: '22px 72px 0', padding: '26px 38px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>🌱</span>
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 32, color: C.green }}>พื้นที่พัฒนา</span>
        </div>
        <div style={{ fontSize: 25, lineHeight: 1.55, color: C.ink }}>{topInfo.growth}</div>
      </div>

      {/* ── คู่ซี้ ── */}
      <div style={{ textAlign: 'center', marginTop: 34 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 23, color: C.brownSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 23 }}>✨</span> คู่ซี้ของคุณคือ
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 48px 14px 18px',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              boxShadow: shadow('0 10px 30px rgba(120,86,50,0.3)'),
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                marginRight: 22,
                background: 'radial-gradient(circle at 50% 42%, #f6efe0, #e3d1ac)',
                border: '2px solid rgba(255,255,255,0.6)',
              }}
            >
              <img
                src={bfImgSrc}
                alt={bfInfo.thaiName}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: '50% 55%' }}
              />
            </div>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 36, color: C.pairText, whiteSpace: 'nowrap' }}>
              {bfInfo.thaiName} ({bfInfo.title})
            </span>
          </div>
        </div>
        <div style={{ marginTop: 16, fontStyle: 'italic', fontSize: 22, color: C.brownSoft }}>
          {topInfo.bestFriendReason}
        </div>
      </div>

      {/* ── footer ── */}
      <div style={{ textAlign: 'center', marginTop: 30, paddingBottom: 44 }}>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: 'rgba(139,101,58,0.75)' }}>
          ✦ Math Isekai Quiz ✦
        </span>
      </div>
    </div>
    );
  };

  return (
    <div className="screen result-screen">
      {/* การ์ดบนจอ (ย่อด้วย transform) */}
      <div ref={wrapRef} style={{ width: '100%', maxWidth: CARD_W, margin: '0 auto' }}>
        <div style={{ height: CARD_H * scale, overflow: 'hidden' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CARD_W, height: CARD_H }}>
            {renderCard(false)}
          </div>
        </div>
      </div>

      {/* การ์ดซ่อนสำหรับ export (นอกจอ, ขนาดเต็ม 1080×1920) */}
      <div style={{ position: 'absolute', left: -99999, top: 0, zIndex: -1 }} aria-hidden="true">
        <div ref={cardRef}>{renderCard(true)}</div>
      </div>

      {/* ปุ่มดำเนินการ — บันทึกรูป + ดูคะแนน อยู่แถวเดียวกัน */}
      <div className="result-actions">
        <div className="action-row">
          <button className="btn-primary" onClick={saveImage} disabled={saving}>
            {saving ? '⏳ กำลังบันทึก...' : '📸 บันทึกรูปผลลัพธ์'}
          </button>
          <button className="btn-secondary" onClick={() => setShowScores(v => !v)}>
            {showScores ? '🔽 ซ่อนคะแนน' : '📊 ดูคะแนน'}
          </button>
        </div>
        <button className="btn-secondary" onClick={onRestart}>
          🔄 เล่นใหม่
        </button>
      </div>

      {/* แถบคะแนน (แสดงเมื่อกดปุ่มดูคะแนน) */}
      {showScores && (
        <div className="detail-card">
          <div className="score-bars">
            {sorted.map(({ key, score }) => {
              const info = ARCHETYPE_INFO[key];
              const pct = Math.round((score / maxScore) * BAR_MAX);
              const filled = '█'.repeat(pct);
              const empty = '░'.repeat(BAR_MAX - pct);
              return (
                <div key={key} className={`score-row ${key === top.key ? 'score-row--top' : ''}`}>
                  <span className="score-name">{info.icon} {key}</span>
                  <span className="score-bar-text">{filled}{empty}</span>
                  <span className="score-pts">{score} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
