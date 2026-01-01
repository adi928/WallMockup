import { useState, useRef } from 'react';

export default function DraggablePainting({
  painting,
  pixelsPerInch,
  onPositionChange,
  onRemove
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const displayWidth = painting.widthInches * pixelsPerInch;
  const displayHeight = painting.heightInches * pixelsPerInch;

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

  return (
    <div
      ref={elementRef}
      className={`draggable-painting ${isDragging ? 'dragging' : ''}`}
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
      <img
        src={painting.imageUrl}
        alt={`Painting ${painting.id}`}
        draggable={false}
      />
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
      <div className="painting-info">
        {painting.widthInches}" x {painting.heightInches}"
      </div>
    </div>
  );
}
