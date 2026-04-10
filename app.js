const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 80;
const DATA_FILE = path.join(__dirname, 'todos.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper functions
function loadTodos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading todos:', err);
  }
  return [];
}

function saveTodos(todos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Error saving todos:', err);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/todos', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todos = loadTodos();
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  let todos = loadTodos();
  const id = parseInt(req.params.id);
  todos = todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        title: req.body.title !== undefined ? req.body.title : todo.title,
        completed: req.body.completed !== undefined ? req.body.completed : todo.completed
      };
    }
    return todo;
  });
  saveTodos(todos);
  const updated = todos.find(t => t.id === id);
  res.json(updated);
});

app.delete('/api/todos/:id', (req, res) => {
  let todos = loadTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  saveTodos(todos);
  res.json({ success: true, message: 'Todo deleted' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TODO App running on port ${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/`);
});
