import http from 'http';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'pet-care-data.json');
const IMAGES_DIR = path.join(__dirname, 'images');

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const sendError = (res, statusCode, message) => sendJson(res, statusCode, { error: message });
const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

const readDatabase = async () => {
  const raw = await readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
};

const writeDatabase = async (db) => {
  await writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
};

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  const body = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(body);
};

const findPet = (db, petId) => db.pets.find((p) => p.id === petId);
const findTask = (db, taskId) => db.tasks.find((t) => t.id === taskId);
const findTaskForPet = (db, petId, taskId) => db.tasks.find((t) => t.petId === petId && t.id === taskId);
const findPlan = (db, planId) => db.plans.find((p) => p.id === planId);

const validateNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (method === 'GET' && pathname.startsWith('/images/')) {
      const relativePath = decodeURIComponent(pathname.replace('/images/', ''));
      const imagePath = path.join(IMAGES_DIR, relativePath);
      const normalized = path.normalize(imagePath);

      if (!normalized.startsWith(IMAGES_DIR)) {
        return sendError(res, 400, 'Invalid image path');
      }

      let imageBuffer;
      try {
        imageBuffer = await readFile(normalized);
      } catch (error) {
        if (error && error.code === 'ENOENT') {
          return sendError(res, 404, 'Image not found');
        }
        throw error;
      }
      const ext = path.extname(normalized).toLowerCase();
      const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(imageBuffer);
      return;
    }

    if (method === 'GET' && pathname === '/pets') {
      const db = await readDatabase();
      return sendJson(res, 200, { status: 'ok', pets: db.pets });
    }

    const petByIdMatch = pathname.match(/^\/pets\/([^/]+)$/);
    if (method === 'GET' && petByIdMatch) {
      const petId = petByIdMatch[1];
      const db = await readDatabase();
      const pet = findPet(db, petId);
      if (!pet) return sendError(res, 404, 'Failed to find pet');
      return sendJson(res, 200, { status: 'ok', pet });
    }

    const petTasksMatch = pathname.match(/^\/pets\/([^/]+)\/tasks$/);
    if (method === 'GET' && petTasksMatch) {
      const petId = petTasksMatch[1];
      const db = await readDatabase();
      const pet = findPet(db, petId);
      if (!pet) return sendError(res, 404, 'Failed to find pet');
      const tasks = db.tasks.filter((task) => task.petId === petId);
      return sendJson(res, 200, { status: 'ok', tasks });
    }

    const petTaskByIdMatch = pathname.match(/^\/pets\/([^/]+)\/tasks\/([^/]+)$/);
    if (method === 'GET' && petTaskByIdMatch) {
      const petId = petTaskByIdMatch[1];
      const taskId = petTaskByIdMatch[2];
      const db = await readDatabase();
      const pet = findPet(db, petId);
      if (!pet) return sendError(res, 404, 'Failed to find pet');
      const task = findTaskForPet(db, petId, taskId);
      if (!task) return sendError(res, 404, 'Failed to find task');
      return sendJson(res, 200, { status: 'ok', task });
    }

    const petLogsMatch = pathname.match(/^\/pets\/([^/]+)\/logs$/);
    if (method === 'GET' && petLogsMatch) {
      const petId = petLogsMatch[1];
      const db = await readDatabase();
      const pet = findPet(db, petId);
      if (!pet) return sendError(res, 404, 'Failed to find pet');
      const logs = db.logs
        .filter((log) => log.petId === petId)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      return sendJson(res, 200, { status: 'ok', logs });
    }

    if (method === 'POST' && petLogsMatch) {
      const petId = petLogsMatch[1];
      const db = await readDatabase();
      const pet = findPet(db, petId);
      if (!pet) return sendError(res, 404, 'Failed to find pet');

      let body;
      try {
        body = await parseJsonBody(req);
      } catch {
        return sendError(res, 400, 'Invalid request body');
      }

      const { taskId, completedAt, note } = body;
      if (!validateNonEmptyString(taskId)) return sendError(res, 400, 'Invalid request body');

      const task = findTaskForPet(db, petId, taskId);
      if (!task) return sendError(res, 404, 'Failed to find task');

      if (note !== undefined && typeof note !== 'string') {
        return sendError(res, 400, 'Invalid request body');
      }

      if (completedAt !== undefined && Number.isNaN(Date.parse(completedAt))) {
        return sendError(res, 400, 'Invalid request body');
      }

      const log = {
        id: `log-${uuidv4()}`,
        petId,
        taskId,
        completedAt: completedAt || new Date().toISOString(),
        note: note || ''
      };

      db.logs.push(log);
      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', log });
    }

    if (method === 'GET' && pathname === '/plans') {
      const db = await readDatabase();
      return sendJson(res, 200, { status: 'ok', plans: db.plans });
    }

    const planByIdMatch = pathname.match(/^\/plans\/([^/]+)$/);
    if (method === 'GET' && planByIdMatch) {
      const planId = planByIdMatch[1];
      const db = await readDatabase();
      const plan = findPlan(db, planId);
      if (!plan) return sendError(res, 404, 'Failed to find plan');

      const tasks = plan.taskIds.map((taskId) => findTask(db, taskId)).filter(Boolean);
      return sendJson(res, 200, { status: 'ok', plan: { ...plan, tasks } });
    }

    if (method === 'POST' && pathname === '/plans') {
      const db = await readDatabase();
      let body;
      try {
        body = await parseJsonBody(req);
      } catch {
        return sendError(res, 400, 'Invalid request body');
      }

      const { title, description } = body;
      if (!validateNonEmptyString(title)) return sendError(res, 400, 'Invalid request body');
      if (description !== undefined && typeof description !== 'string') return sendError(res, 400, 'Invalid request body');

      const plan = {
        id: `plan-${uuidv4()}`,
        title: title.trim(),
        description: description || '',
        taskIds: []
      };

      db.plans.push(plan);
      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', plan });
    }

    if (method === 'PATCH' && planByIdMatch) {
      const planId = planByIdMatch[1];
      const db = await readDatabase();
      const plan = findPlan(db, planId);
      if (!plan) return sendError(res, 404, 'Failed to find plan');

      let body;
      try {
        body = await parseJsonBody(req);
      } catch {
        return sendError(res, 400, 'Invalid request body');
      }

      const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
      const hasDescription = Object.prototype.hasOwnProperty.call(body, 'description');

      if (!hasTitle && !hasDescription) return sendError(res, 400, 'Invalid request body');
      if (hasTitle && !validateNonEmptyString(body.title)) return sendError(res, 400, 'Invalid request body');
      if (hasDescription && typeof body.description !== 'string') return sendError(res, 400, 'Invalid request body');

      if (hasTitle) plan.title = body.title.trim();
      if (hasDescription) plan.description = body.description;

      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', plan });
    }

    if (method === 'DELETE' && planByIdMatch) {
      const planId = planByIdMatch[1];
      const db = await readDatabase();
      const idx = db.plans.findIndex((plan) => plan.id === planId);
      if (idx < 0) return sendError(res, 404, 'Failed to find plan');

      db.plans.splice(idx, 1);
      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', message: `Plan with id ${planId} deleted` });
    }

    const planTasksMatch = pathname.match(/^\/plans\/([^/]+)\/tasks$/);
    if (method === 'POST' && planTasksMatch) {
      const planId = planTasksMatch[1];
      const db = await readDatabase();
      const plan = findPlan(db, planId);
      if (!plan) return sendError(res, 404, 'Failed to find plan');

      let body;
      try {
        body = await parseJsonBody(req);
      } catch {
        return sendError(res, 400, 'Invalid request body');
      }

      const { taskId } = body;
      if (!validateNonEmptyString(taskId)) return sendError(res, 400, 'Invalid request body');

      const task = findTask(db, taskId);
      if (!task) return sendError(res, 404, 'Failed to find task');
      if (plan.taskIds.includes(taskId)) return sendError(res, 409, 'Task already exists in plan');

      plan.taskIds.push(taskId);
      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', plan });
    }

    const planTaskByIdMatch = pathname.match(/^\/plans\/([^/]+)\/tasks\/([^/]+)$/);
    if (method === 'DELETE' && planTaskByIdMatch) {
      const planId = planTaskByIdMatch[1];
      const taskId = planTaskByIdMatch[2];
      const db = await readDatabase();
      const plan = findPlan(db, planId);
      if (!plan) return sendError(res, 404, 'Failed to find plan');

      const taskIndex = plan.taskIds.indexOf(taskId);
      if (taskIndex < 0) return sendError(res, 404, 'Failed to find task in plan');

      plan.taskIds.splice(taskIndex, 1);
      await writeDatabase(db);
      return sendJson(res, 200, { status: 'ok', plan });
    }

    return sendError(res, 404, 'Endpoint not found');
  } catch (error) {
    const isWriteOperation = ['POST', 'PATCH', 'DELETE'].includes(method);
    return sendError(res, 500, isWriteOperation ? 'Failed to write database' : 'Failed to read database');
  }
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
