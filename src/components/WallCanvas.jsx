import { useRef, useState, useEffect } from 'react';
import DraggablePainting from './DraggablePainting';
import { calculatePixelsPerInch } from '../utils/scaleUtils';

export default function WallCanvas({
  wall,
  paintings,
  onPaintingPositionChange,
  onRemovePainting,
  onFrameChange
}) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [fitScale, setFitScale] = useState(0.5);

  // Calculate the "fit to screen" scale as a reference point
  useEffect(() => {
    if (!containerRef.current || !wall) return;

    const calculateFitScale = () => {
      const container = containerRef.current;
      const maxWidth = container.clientWidth - 40;
      const maxHeight = window.innerHeight * 0.6;

      const scaleX = maxWidth / wall.imageWidth;
      const scaleY = maxHeight / wall.imageHeight;
      const newFitScale = Math.min(scaleX, scaleY, 1);

      setFitScale(newFitScale);
      // Set initial scale to fit
      setScale(newFitScale);
    };

    calculateFitScale();
    window.addEventListener('resize', calculateFitScale);
    return () => window.removeEventListener('resize', calculateFitScale);
  }, [wall]);

  if (!wall) {
    return (
      <div className="wall-canvas empty">
        <p>Upload a wall image to get started</p>
      </div>
    );
  }

  const containerSize = {
    width: wall.imageWidth * scale,
    height: wall.imageHeight * scale
  };

  // Calculate pixels per inch at current display scale
  const pixelsPerInch = calculatePixelsPerInch(
    wall.imageWidth * scale,
    wall.realWidth
  );

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const handleFitToScreen = () => {
    setScale(fitScale);
  };

  // Scale range: from 5% to 150%
  const minScale = 0.05;
  const maxScale = 1.5;

  return (
    <div className="wall-canvas-container" ref={containerRef}>
      <div className="wall-controls">
        <div className="wall-info">
          <span>Wall: {wall.realWidth}" x {wall.realHeight}"</span>
        </div>
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => setScale(Math.max(minScale, scale - 0.1))}
            title="Zoom out"
          >
            −
          </button>
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step="0.01"
            value={scale}
            onChange={handleScaleChange}
            className="zoom-slider"
          />
          <button
            className="zoom-btn"
            onClick={() => setScale(Math.min(maxScale, scale + 0.1))}
            title="Zoom in"
          >
            +
          </button>
          <span className="scale-value">{(scale * 100).toFixed(0)}%</span>
          <button
            className="fit-btn"
            onClick={handleFitToScreen}
            title="Fit to screen"
          >
            Fit
          </button>
        </div>
      </div>
      <div className="wall-scroll-container" ref={scrollRef}>
        <div
          className="wall-canvas"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            backgroundImage: `url(${wall.imageUrl})`,
            backgroundSize: 'cover',
            position: 'relative'
          }}
        >
          {paintings.map(painting => (
            <DraggablePainting
              key={painting.id}
              painting={painting}
              pixelsPerInch={pixelsPerInch}
              onPositionChange={onPaintingPositionChange}
              onRemove={onRemovePainting}
              onFrameChange={onFrameChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
