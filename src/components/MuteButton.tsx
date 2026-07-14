import React from 'react';

interface Props {
  muted: boolean;
  onToggle: () => void;
}

export default function MuteButton({ muted, onToggle }: Props) {
  return (
    <button
      className="mute-btn"
      onClick={onToggle}
      title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
      aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
