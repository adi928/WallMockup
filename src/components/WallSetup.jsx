import { useState } from 'react';

export default function WallSetup({ onWallSet }) {
  const [wallImage, setWallImage] = useState(null);
  const [wallWidth, setWallWidth] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWallImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wallImage || !wallWidth || !wallHeight) {
      alert('Please provide wall image and dimensions');
      return;
    }

    const img = new Image();
    img.onload = () => {
      onWallSet({
        imageUrl: previewUrl,
        imageWidth: img.width,
        imageHeight: img.height,
        realWidth: parseFloat(wallWidth),
        realHeight: parseFloat(wallHeight)
      });
    };
    img.src = previewUrl;
  };

  return (
    <div className="wall-setup">
      <h2>Wall Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="wall-image">Wall Image</label>
          <input
            type="file"
            id="wall-image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Wall preview"
              className="wall-preview"
            />
          )}
        </div>

        <div className="dimensions-row">
          <div className="form-group">
            <label htmlFor="wall-width">Wall Width (inches)</label>
            <input
              type="number"
              id="wall-width"
              value={wallWidth}
              onChange={(e) => setWallWidth(e.target.value)}
              min="1"
              step="0.1"
              placeholder="e.g., 120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wall-height">Wall Height (inches)</label>
            <input
              type="number"
              id="wall-height"
              value={wallHeight}
              onChange={(e) => setWallHeight(e.target.value)}
              min="1"
              step="0.1"
              placeholder="e.g., 96"
            />
          </div>
        </div>

        <button type="submit" className="btn primary">
          Set Wall
        </button>
      </form>
    </div>
  );
}
