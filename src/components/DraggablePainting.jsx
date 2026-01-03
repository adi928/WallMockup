import { useState, useRef } from 'react';

export const FRAME_STYLES = [
  { id: 'none', name: 'No Frame' },
  { id: 'modern-black', name: 'Modern Black' },
  { id: 'modern-white', name: 'Modern White' },
  { id: 'classic-gold', name: 'Classic Gold' },
  { id: 'classic-silver', name: 'Classic Silver' },
  { id: 'rustic-wood', name: 'Rustic Wood' },
  { id: 'dark-wood', name: 'Dark Wood' },
  { id: 'gallery-float', name: 'Gallery Float' }
];

export default function DraggablePainting({
  painting,
  pixelsPerInch,
  onPositionChange,
  onRemove,
  onFrameChange
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showFramePicker, setShowFramePicker] = useState(false);
  const elementRef = useRef(null);

  const displayWidth = painting.widthInches * pixelsPerInch;
  const displayHeight = painting.heightInches * pixelsPerInch;
  const frameStyle = painting.frameStyle || 'none';

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const rect = elementRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const parent = elementRef.current.parentElement;
    const parentRect = parent.getBoundingClientRect();

    let newX = e.clientX - parentRect.left - dragOffset.x;
    let newY = e.clientY - parentRect.top - dragOffset.y;

    // Keep within bounds
    newX = Math.max(0, Math.min(newX, parentRect.width - displayWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - displayHeight));

    onPositionChange(painting.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global listeners when dragging
  if (isDragging) {
    document.onmousemove = handleMouseMove;
    document.onmouseup = handleMouseUp;
  } else {
    document.onmousemove = null;
    document.onmouseup = null;
  }

  const handleFrameSelect = (e, styleId) => {
    e.stopPropagation();
    onFrameChange(painting.id, styleId);
    setShowFramePicker(false);
  };

  const toggleFramePicker = (e) => {
    e.stopPropagation();
    setShowFramePicker(!showFramePicker);
  };

  return (
    <div
      ref={elementRef}
      className={`draggable-painting frame-${frameStyle} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: painting.position.x,
        top: painting.position.y,
        width: displayWidth,
        height: displayHeight,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="painting-frame">
        <img
          src={painting.imageUrl}
          alt={`Painting ${painting.id}`}
          draggable={false}
        />
      </div>
      <button
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(painting.id);
        }}
        title="Remove painting"
      >
        &times;
      </button>
      <button
        className="frame-btn"
        onClick={toggleFramePicker}
        title="Change frame"
      >
        ⬜
      </button>
      {showFramePicker && (
        <div className="frame-picker">
          {FRAME_STYLES.map(style => (
            <button
              key={style.id}
              className={`frame-option ${frameStyle === style.id ? 'active' : ''}`}
              onClick={(e) => handleFrameSelect(e, style.id)}
            >
              <span className={`frame-preview frame-${style.id}`}></span>
              <span className="frame-name">{style.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="painting-info">
        {painting.widthInches}" x {painting.heightInches}"
      </div>
    </div>
  );
}
