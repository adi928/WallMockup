const DB_NAME = 'WallMockupDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('name', 'name', { unique: false });
      }
    };
  });
}

/**
 * Save a project to IndexedDB
 */
export async function saveProject(project) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const projectData = {
      ...project,
      id: project.id || crypto.randomUUID(),
      updatedAt: Date.now()
    };

    const request = store.put(projectData);
    request.onsuccess = () => resolve(projectData);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all saved projects
 */
export async function getAllProjects() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('updatedAt');

    const request = index.getAll();
    request.onsuccess = () => {
      // Sort by updatedAt descending (most recent first)
      const projects = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(projects);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get a single project by ID
 */
export async function getProject(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Convert an image URL (blob or data URL) to base64
 */
export function imageUrlToBase64(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('data:')) {
      resolve(url);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Serialize project data for saving (converts blob URLs to base64)
 */
export async function serializeProject(name, wall, paintings) {
  const serialized = {
    name,
    version: 1,
    createdAt: Date.now(),
    wall: null,
    paintings: []
  };

  if (wall) {
    serialized.wall = {
      imageData: await imageUrlToBase64(wall.imageUrl),
      imageWidth: wall.imageWidth,
      imageHeight: wall.imageHeight,
      realWidth: wall.realWidth,
      realHeight: wall.realHeight
    };
  }

  for (const painting of paintings) {
    serialized.paintings.push({
      id: painting.id,
      imageData: await imageUrlToBase64(painting.imageUrl),
      widthInches: painting.widthInches,
      heightInches: painting.heightInches,
      position: painting.position,
      frameStyle: painting.frameStyle || 'none'
    });
  }

  return serialized;
}

/**
 * Deserialize project data for loading
 */
export function deserializeProject(data) {
  const result = {
    wall: null,
    paintings: []
  };

  if (data.wall) {
    result.wall = {
      imageUrl: data.wall.imageData,
      imageWidth: data.wall.imageWidth,
      imageHeight: data.wall.imageHeight,
      realWidth: data.wall.realWidth,
      realHeight: data.wall.realHeight
    };
  }

  result.paintings = data.paintings.map(p => ({
    id: p.id,
    imageUrl: p.imageData,
    widthInches: p.widthInches,
    heightInches: p.heightInches,
    position: p.position,
    frameStyle: p.frameStyle || 'none'
  }));

  return result;
}

/**
 * Export project as downloadable JSON file
 */
export function exportProjectToFile(project, filename) {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${project.name || 'project'}.wallmockup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import project from file
 */
export function importProjectFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid project file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
