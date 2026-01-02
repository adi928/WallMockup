import { useState, useEffect, useRef } from 'react';
import {
  saveProject,
  getAllProjects,
  deleteProject,
  serializeProject,
  deserializeProject,
  exportProjectToFile,
  importProjectFromFile
} from '../utils/projectDb';

export default function ProjectManager({
  wall,
  paintings,
  onLoadProject,
  currentProjectId,
  onProjectIdChange
}) {
  const [projects, setProjects] = useState([]);
  const [showList, setShowList] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProjectList();
  }, []);

  const loadProjectList = async () => {
    try {
      const list = await getAllProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    if (!wall) {
      showMessage('Nothing to save - set up a wall first', 'error');
      return;
    }

    const name = projectName.trim() || `Project ${new Date().toLocaleDateString()}`;
    setSaving(true);

    try {
      const serialized = await serializeProject(name, wall, paintings);
      serialized.id = currentProjectId; // Keep same ID if updating
      const saved = await saveProject(serialized);

      onProjectIdChange(saved.id);
      setProjectName(name);
      await loadProjectList();
      showMessage(`Saved "${name}"`);
    } catch (err) {
      console.error('Failed to save:', err);
      showMessage('Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (project) => {
    try {
      const { wall: loadedWall, paintings: loadedPaintings } = deserializeProject(project);
      onLoadProject(loadedWall, loadedPaintings);
      onProjectIdChange(project.id);
      setProjectName(project.name);
      setShowList(false);
      showMessage(`Loaded "${project.name}"`);
    } catch (err) {
      console.error('Failed to load:', err);
      showMessage('Failed to load project', 'error');
    }
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    if (!confirm(`Delete "${project.name}"?`)) return;

    try {
      await deleteProject(project.id);
      if (currentProjectId === project.id) {
        onProjectIdChange(null);
      }
      await loadProjectList();
      showMessage(`Deleted "${project.name}"`);
    } catch (err) {
      console.error('Failed to delete:', err);
      showMessage('Failed to delete project', 'error');
    }
  };

  const handleExport = async () => {
    if (!wall) {
      showMessage('Nothing to export - set up a wall first', 'error');
      return;
    }

    setSaving(true);
    try {
      const name = projectName.trim() || 'project';
      const serialized = await serializeProject(name, wall, paintings);
      exportProjectToFile(serialized, `${name}.wallmockup.json`);
      showMessage('Project exported');
    } catch (err) {
      console.error('Failed to export:', err);
      showMessage('Failed to export project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importProjectFromFile(file);
      const { wall: loadedWall, paintings: loadedPaintings } = deserializeProject(data);
      onLoadProject(loadedWall, loadedPaintings);
      onProjectIdChange(null); // New project, no ID yet
      setProjectName(data.name || 'Imported Project');
      showMessage(`Imported "${data.name || 'project'}"`);
    } catch (err) {
      console.error('Failed to import:', err);
      showMessage('Failed to import - invalid file', 'error');
    }

    // Reset file input
    e.target.value = '';
  };

  const handleNewProject = () => {
    if (wall && !confirm('Start a new project? Unsaved changes will be lost.')) {
      return;
    }
    onLoadProject(null, []);
    onProjectIdChange(null);
    setProjectName('');
    showMessage('New project started');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="project-manager">
      <h2>Project</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="project-name-input">
        <input
          type="text"
          placeholder="Project name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="project-actions">
        <button
          className="btn primary"
          onClick={handleSave}
          disabled={saving || !wall}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          className="btn secondary"
          onClick={() => setShowList(!showList)}
        >
          {showList ? 'Hide' : 'Open'}
        </button>
      </div>

      <div className="project-actions">
        <button className="btn outline-secondary" onClick={handleExport} disabled={!wall}>
          Export
        </button>
        <button
          className="btn outline-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.wallmockup.json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      <button className="btn text" onClick={handleNewProject}>
        + New Project
      </button>

      {showList && (
        <div className="project-list">
          <h3>Saved Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <p className="no-projects">No saved projects yet</p>
          ) : (
            <ul>
              {projects.map(project => (
                <li
                  key={project.id}
                  className={project.id === currentProjectId ? 'active' : ''}
                  onClick={() => handleLoad(project)}
                >
                  <div className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-date">{formatDate(project.updatedAt)}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, project)}
                    title="Delete project"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
