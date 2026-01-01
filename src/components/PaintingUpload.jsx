import { useState } from 'react';

export default function PaintingUpload({ onAddPainting, disabled }) {
  const [paintingImage, setPaintingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaintingImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
      heightInches: parseFloat(height)
    });

    // Reset form
    setPaintingImage(null);
    setPreviewUrl(null);
    setWidth('');
    setHeight('');

    // Reset file input
    const fileInput = document.getElementById('painting-image');
    if (fileInput) fileInput.value = '';
  };

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

        <button type="submit" className="btn secondary" disabled={disabled}>
          Add Painting
        </button>
      </form>
    </div>
  );
}
