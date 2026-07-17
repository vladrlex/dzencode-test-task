# Orders & Products — SPA (dZENcode Test Task)

A single-page application for managing **Orders** and **Products**, built as a test assignment for **dZENcode**. Includes real-time active-session tracking via WebSockets, client-side routing, global state management, and a component-based architecture.

**Repository:** https://github.com/vladrlex/dzencode-test-task

---

## Stack

| Layer | Technology |
|---|---|
| UI | React (latest) + TypeScript |
| State | Redux Toolkit |
| Routing | React Router |
| Real-time | Socket.io (active sessions counter) |
| Styling | CSS, BEM methodology |
| i18n | react-i18next (multi-language support) |
| Backend | Node.js + Express |
| Containers | Docker + Docker Compose |

---

## Features

### Top Menu
- Live clock and current date, updated in real time.
- Active sessions counter — number of open browser tabs/windows across all connected clients, synced via WebSocket.

### Navigation Menu
- Route links between **Orders** and **Products** pages.

### Orders
- List of all orders: title, product count, creation date in two formats, total sum in **USD** and **UAH**.
- Click an order to open a detail panel with the full list of products inside it. The panel can be closed.
- Delete an order via a confirmation popup.

### Products
- List of all products: name, type, warranty dates in different formats, price in different currencies, and the parent order's name.
- Filter products by type (select component).

---

## Project Structure

```
dzencode-test-task/
├── backend/          # Node.js + Express server, Socket.io
├── frontend/          # React + TypeScript SPA
└── docker-compose.yml
```

---

## Getting Started

### Option 1 — Docker (recommended)

**Requirements:** Docker Desktop installed and running.

```bash
git clone https://github.com/vladrlex/dzencode-test-task.git
cd dzencode-test-task
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend / Socket.io: `http://localhost:5000`

### Option 2 — Local development

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server (Vite) will print the local URL to open, typically [http://localhost:5173](http://localhost:5173).

---

## Notes / Possible Improvements

- Add unit and integration tests for `Orders` and `Products` reducers/components.
- Add a database schema file (currently mock data lives in `app.js`).
- Add loading/error states polish and empty-state illustrations.
- Deploy to a public host (VDS) for reviewer access without local setup.

---

## Self-check

Before submitting, the project was launched from a clean clone using only the instructions in this README to confirm setup accuracy.
