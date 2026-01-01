import { useState } from 'react';
import WallSetup from './components/WallSetup';
import WallCanvas from './components/WallCanvas';
import PaintingUpload from './components/PaintingUpload';

function App() {
  const [wall, setWall] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [nextId, setNextId] = useState(1);

  const handleWallSet = (wallData) => {
    setWall(wallData);
    // Clear paintings when wall changes
    setPaintings([]);
  };

  const handleAddPainting = (paintingData) => {
    const newPainting = {
      id: nextId,
      ...paintingData,
      position: { x: 50, y: 50 } // Default position
    };
    setPaintings([...paintings, newPainting]);
    setNextId(nextId + 1);
  };

  const handlePositionChange = (id, newPosition) => {
    setPaintings(paintings.map(p =>
      p.id === id ? { ...p, position: newPosition } : p
    ));
  };

  const handleRemovePainting = (id) => {
    setPaintings(paintings.filter(p => p.id !== id));
  };

  const handleReset = () => {
    setWall(null);
    setPaintings([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wall Mockup Tool</h1>
        <p>Visualize paintings on your wall at accurate scale</p>
      </header>

      <main className="app-main">
        <div className="sidebar">
          {!wall ? (
            <WallSetup onWallSet={handleWallSet} />
          ) : (
            <div className="wall-set-info">
              <h2>Wall Set</h2>
              <p>{wall.realWidth}" x {wall.realHeight}"</p>
              <button className="btn outline" onClick={handleReset}>
                Change Wall
              </button>
            </div>
          )}

          <PaintingUpload
            onAddPainting={handleAddPainting}
            disabled={!wall}
          />

          {paintings.length > 0 && (
            <div className="paintings-list">
              <h3>Paintings ({paintings.length})</h3>
              <ul>
                {paintings.map(p => (
                  <li key={p.id}>
                    <span>Painting #{p.id}</span>
                    <span className="dims">{p.widthInches}" x {p.heightInches}"</span>
                    <button
                      className="remove-small"
                      onClick={() => handleRemovePainting(p.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="canvas-area">
          <WallCanvas
            wall={wall}
            paintings={paintings}
            onPaintingPositionChange={handlePositionChange}
            onRemovePainting={handleRemovePainting}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
