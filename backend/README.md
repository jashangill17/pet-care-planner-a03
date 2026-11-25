# Backend Dev Server

This local development server provides API endpoints for the Assignment 1 Pet Care Planner.

## Setup and Run

```sh
cd backend
npm install
npm start
```

> **NOTE:** All endpoints are located at `http://localhost:3000`

## Images Endpoint

Pet images are served as static files from the local `backend/images/` directory.

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| `GET`  | `/images/:filename` | Retrieve a pet image file       |

### `GET /images/:filename`

Returns the raw image file bytes for a matching filename in `backend/images/`.

Example:

`http://localhost:3000/images/pet-1-mochi.jpg`

**Response**
- `200` with image content (`image/jpeg`, `image/png`, `image/webp`, or `image/gif`)

**Throws**
- `404` - Image not found
- `400` - Invalid image path

## Data Models

### Pet

```json
{
  "id": "pet-1",
  "name": "Mochi",
  "species": "dog",
  "breed": "Shiba Inu",
  "ageYears": 4,
  "avatarUrl": "https://example.com/pets/mochi.jpg"
}
```

### Care Task

```json
{
  "id": "task-1",
  "petId": "pet-1",
  "title": "Morning feed",
  "category": "feeding",
  "frequency": "daily",
  "dueTime": "08:00",
  "notes": "1 cup kibble",
  "isCompletedToday": false
}
```

### Care Log Entry

```json
{
  "id": "log-1",
  "petId": "pet-1",
  "taskId": "task-1",
  "completedAt": "2026-01-15T08:02:00.000Z",
  "note": "Ate full portion"
}
```

### Care Plan

```json
{
  "id": "plan-1",
  "title": "Daily Routine",
  "description": "Standard weekday routine",
  "taskIds": ["task-1", "task-3"]
}
```

---

## Pets Endpoints

| Method | Endpoint    | Description             |
|--------|-------------|-------------------------|
| `GET`  | `/pets`     | Retrieve all pets       |
| `GET`  | `/pets/:id` | Retrieve a single pet   |

### `GET /pets`

Returns all pets.

**Response Data**
```json
{
  "status": "ok",
  "pets": [
    {
      "id": "pet-1",
      "name": "Mochi",
      "species": "dog",
      "breed": "Shiba Inu",
      "ageYears": 4,
      "avatarUrl": "https://example.com/pets/mochi.jpg"
    }
  ]
}
```

**Throws**
- `500` - Failed to read database

### `GET /pets/:id`

Returns one pet.

**Response Data**
```json
{
  "status": "ok",
  "pet": {
    "id": "pet-1",
    "name": "Mochi",
    "species": "dog",
    "breed": "Shiba Inu",
    "ageYears": 4,
    "avatarUrl": "https://example.com/pets/mochi.jpg"
  }
}
```

**Throws**
- `404` - Failed to find pet
- `500` - Failed to read database

---

## Tasks Endpoints

Tasks are scoped to a pet.

| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| `GET`  | `/pets/:id/tasks`        | Retrieve tasks for a pet         |
| `GET`  | `/pets/:id/tasks/:taskId`| Retrieve a single task for a pet |

### `GET /pets/:id/tasks`

Returns tasks for one pet.

**Response Data**
```json
{
  "status": "ok",
  "tasks": [
    {
      "id": "task-1",
      "petId": "pet-1",
      "title": "Morning feed",
      "category": "feeding",
      "frequency": "daily",
      "dueTime": "08:00",
      "notes": "1 cup kibble",
      "isCompletedToday": false
    }
  ]
}
```

**Throws**
- `404` - Failed to find pet
- `500` - Failed to read database

### `GET /pets/:id/tasks/:taskId`

Returns one task for one pet.

**Response Data**
```json
{
  "status": "ok",
  "task": {
    "id": "task-1",
    "petId": "pet-1",
    "title": "Morning feed",
    "category": "feeding",
    "frequency": "daily",
    "dueTime": "08:00",
    "notes": "1 cup kibble",
    "isCompletedToday": false
  }
}
```

**Throws**
- `404` - Failed to find pet
- `404` - Failed to find task
- `500` - Failed to read database

---

## Care Logs Endpoints

Care logs represent task completions.

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| `GET`  | `/pets/:id/logs`  | Retrieve completion log entries |
| `POST` | `/pets/:id/logs`  | Create a completion log entry  |

### `GET /pets/:id/logs`

Returns care log entries for one pet (newest first).

**Response Data**
```json
{
  "status": "ok",
  "logs": [
    {
      "id": "log-1",
      "petId": "pet-1",
      "taskId": "task-1",
      "completedAt": "2026-01-15T08:02:00.000Z",
      "note": "Ate full portion"
    }
  ]
}
```

**Throws**
- `404` - Failed to find pet
- `500` - Failed to read database

### `POST /pets/:id/logs`

Creates a completion log entry.

**Request Data**
```json
{
  "taskId": "task-1",
  "completedAt": "2026-01-15T08:02:00.000Z",
  "note": "Ate full portion"
}
```

**Validation Rules**
- `taskId` is required and must belong to `:id`.
- `completedAt` is optional; if omitted, server uses current timestamp.
- `note` is optional.

**Response Data**
```json
{
  "status": "ok",
  "log": {
    "id": "log-2",
    "petId": "pet-1",
    "taskId": "task-1",
    "completedAt": "2026-01-15T08:02:00.000Z",
    "note": "Ate full portion"
  }
}
```

**Throws**
- `400` - Invalid request body
- `404` - Failed to find pet
- `404` - Failed to find task
- `500` - Failed to read database
- `500` - Failed to write database

---

## Care Plans Endpoints

Care plans are named collections of tasks.

| Method   | Endpoint                   | Description                            |
|----------|----------------------------|----------------------------------------|
| `GET`    | `/plans`                   | Retrieve all plans                     |
| `GET`    | `/plans/:id`               | Retrieve one plan (including tasks)    |
| `POST`   | `/plans`                   | Create a new plan                      |
| `PATCH`  | `/plans/:id`               | Update a plan's title/description      |
| `DELETE` | `/plans/:id`               | Delete a plan                          |
| `POST`   | `/plans/:id/tasks`         | Add a task to the plan                 |
| `DELETE` | `/plans/:id/tasks/:taskId` | Remove a task from the plan            |

### `GET /plans`

Returns all plans (without expanded tasks).

**Response Data**
```json
{
  "status": "ok",
  "plans": [
    {
      "id": "plan-1",
      "title": "Daily Routine",
      "description": "Standard weekday routine",
      "taskIds": ["task-1", "task-3"]
    }
  ]
}
```

**Throws**
- `500` - Failed to read database

### `GET /plans/:id`

Returns one plan with expanded task objects.

**Response Data**
```json
{
  "status": "ok",
  "plan": {
    "id": "plan-1",
    "title": "Daily Routine",
    "description": "Standard weekday routine",
    "taskIds": ["task-1", "task-3"],
    "tasks": [
      {
        "id": "task-1",
        "petId": "pet-1",
        "title": "Morning feed",
        "category": "feeding",
        "frequency": "daily",
        "dueTime": "08:00",
        "notes": "1 cup kibble",
        "isCompletedToday": false
      }
    ]
  }
}
```

**Throws**
- `404` - Failed to find plan
- `500` - Failed to read database

### `POST /plans`

Creates a new plan.

**Request Data**
```json
{
  "title": "Weekend Routine",
  "description": "Later feeding schedule"
}
```

**Validation Rules**
- `title` is required and must be a non-empty string.
- `description` is optional.

**Response Data**
```json
{
  "status": "ok",
  "plan": {
    "id": "plan-2",
    "title": "Weekend Routine",
    "description": "Later feeding schedule",
    "taskIds": []
  }
}
```

**Throws**
- `400` - Invalid request body
- `500` - Failed to read database
- `500` - Failed to write database

### `PATCH /plans/:id`

Updates a plan.

**Request Data**
```json
{
  "title": "Updated Plan Title",
  "description": "Updated description"
}
```

**Validation Rules**
- At least one of `title` or `description` must be provided.
- If provided, `title` must be a non-empty string.

**Response Data**
```json
{
  "status": "ok",
  "plan": {
    "id": "plan-1",
    "title": "Updated Plan Title",
    "description": "Updated description",
    "taskIds": ["task-1", "task-3"]
  }
}
```

**Throws**
- `400` - Invalid request body
- `404` - Failed to find plan
- `500` - Failed to read database
- `500` - Failed to write database

### `DELETE /plans/:id`

Deletes a plan.

**Response Data**
```json
{
  "status": "ok",
  "message": "Plan with id plan-1 deleted"
}
```

**Throws**
- `404` - Failed to find plan
- `500` - Failed to read database
- `500` - Failed to write database

### `POST /plans/:id/tasks`

Adds a task to a plan.

**Request Data**
```json
{
  "taskId": "task-1"
}
```

**Validation Rules**
- `taskId` is required.
- `taskId` must refer to an existing task.
- Duplicate task ids are not allowed in the same plan.

**Response Data**
```json
{
  "status": "ok",
  "plan": {
    "id": "plan-1",
    "title": "Daily Routine",
    "description": "Standard weekday routine",
    "taskIds": ["task-1", "task-3"]
  }
}
```

**Throws**
- `400` - Invalid request body
- `404` - Failed to find plan
- `404` - Failed to find task
- `409` - Task already exists in plan
- `500` - Failed to read database
- `500` - Failed to write database

### `DELETE /plans/:id/tasks/:taskId`

Removes a task from a plan.

**Response Data**
```json
{
  "status": "ok",
  "plan": {
    "id": "plan-1",
    "title": "Daily Routine",
    "description": "Standard weekday routine",
    "taskIds": ["task-3"]
  }
}
```

**Throws**
- `404` - Failed to find plan
- `404` - Failed to find task in plan
- `500` - Failed to read database
- `500` - Failed to write database
