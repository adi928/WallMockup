import { useState } from 'react';
import { FRAME_STYLES } from './DraggablePainting';

export default function PaintingUpload({ onAddPainting, disabled }) {
  const [paintingImage, setPaintingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sizePreset, setSizePreset] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [frameStyle, setFrameStyle] = useState('modern-black');

  const STANDARD_SIZES = [
    { label: 'Select size...', value: '', width: '', height: '' },
    { label: '8" × 10"', value: '8x10', width: 8, height: 10 },
    { label: '10" × 8"', value: '10x8', width: 10, height: 8 },
    { label: '11" × 14"', value: '11x14', width: 11, height: 14 },
    { label: '14" × 11"', value: '14x11', width: 14, height: 11 },
    { label: '12" × 16"', value: '12x16', width: 12, height: 16 },
    { label: '16" × 12"', value: '16x12', width: 16, height: 12 },
    { label: '16" × 20"', value: '16x20', width: 16, height: 20 },
    { label: '20" × 16"', value: '20x16', width: 20, height: 16 },
    { label: '18" × 24"', value: '18x24', width: 18, height: 24 },
    { label: '24" × 18"', value: '24x18', width: 24, height: 18 },
    { label: '20" × 24"', value: '20x24', width: 20, height: 24 },
    { label: '24" × 20"', value: '24x20', width: 24, height: 20 },
    { label: '24" × 30"', value: '24x30', width: 24, height: 30 },
    { label: '30" × 24"', value: '30x24', width: 30, height: 24 },
    { label: '24" × 36" (2\' × 3\')', value: '24x36', width: 24, height: 36 },
    { label: '36" × 24" (3\' × 2\')', value: '36x24', width: 36, height: 24 },
    { label: '30" × 40"', value: '30x40', width: 30, height: 40 },
    { label: '40" × 30"', value: '40x30', width: 40, height: 30 },
    { label: '36" × 48" (3\' × 4\')', value: '36x48', width: 36, height: 48 },
    { label: '48" × 36" (4\' × 3\')', value: '48x36', width: 48, height: 36 },
    { label: 'Manual', value: 'manual', width: '', height: '' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaintingImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSizePreset(value);
    
    if (value && value !== 'manual') {
      const size = STANDARD_SIZES.find(s => s.value === value);
      if (size) {
        setWidth(size.width.toString());
        setHeight(size.height.toString());
      }
    } else if (value === 'manual') {
      setWidth('');
      setHeight('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paintingImage || !width || !height) {
      alert('Please provide painting image and dimensions');
      return;
    }

    onAddPainting({
      imageUrl: previewUrl,
      widthInches: parseFloat(width),
      heightInches: parseFloat(height),
      frameStyle
    });

    // Reset form
    setPaintingImage(null);
    setPreviewUrl(null);
    setSizePreset('');
    setWidth('');
    setHeight('');
    setFrameStyle('modern-black');

    // Reset file input
    const fileInput = document.getElementById('painting-image');
    if (fileInput) fileInput.value = '';
  };

  const isManualMode = sizePreset === 'manual';

  return (
    <div className={`painting-upload ${disabled ? 'disabled' : ''}`}>
      <h2>Add Painting</h2>
      {disabled && (
        <p className="disabled-message">Set up a wall first to add paintings</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="painting-image">Painting Image</label>
          <input
            type="file"
            id="painting-image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={disabled}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Painting preview"
              className="painting-preview"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="size-preset">Size</label>
          <select
            id="size-preset"
            value={sizePreset}
            onChange={handleSizeChange}
            disabled={disabled}
          >
            {STANDARD_SIZES.map(size => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {isManualMode && (
          <div className="dimensions-row">
            <div className="form-group">
              <label htmlFor="painting-width">Width (inches)</label>
              <input
                type="number"
                id="painting-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                step="0.1"
                placeholder="e.g., 24"
                disabled={disabled}
              />
            </div>

            <div className="form-group">
              <label htmlFor="painting-height">Height (inches)</label>
              <input
                type="number"
                id="painting-height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                step="0.1"
                placeholder="e.g., 36"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {sizePreset && sizePreset !== 'manual' && (
          <p className="size-display">{width}" × {height}"</p>
        )}

        <div className="form-group">
          <label>Frame Style</label>
          <div className="frame-style-selector">
            {FRAME_STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                className={`frame-style-option ${frameStyle === style.id ? 'active' : ''}`}
                onClick={() => setFrameStyle(style.id)}
                disabled={disabled}
                title={style.name}
              >
                <span className={`frame-preview frame-${style.id}`}></span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn secondary" disabled={disabled}>
          Add Painting
        </button>
      </form>
    </div>
  );
}
