require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { CosmosClient, PartitionKey } = require('@azure/cosmos');


const app = express();
const PORT = process.env.PORT;

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

let container;

async function initDb() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container: c } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ["/id"], kind: "Hash" }
  });
  container = c;
  console.log("Connected to Cosmos DB");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/todos', async (req, res) => {
  try {
    const { resources } = await container.items.readAll().fetchAll();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = {
      id: Date.now().toString(),
      title: req.body.title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const { resource } = await container.items.create(newTodo);
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { resource: existing } = await container.item(id, id).read();
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const updated = {
      ...existing,
      title: req.body.title ?? existing.title,
      completed: req.body.completed ?? !existing.completed
    };
    const { resource } = await container.item(id, id).replace(updated);
    res.json(resource);
  } catch (err) {
    console.error(err);
    if (err.code === 404) return res.status(404).json({ error: 'Todo not found' });
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await container.item(id, id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === 404) return res.status(404).json({ error: 'Todo not found' });
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`TODO App running on port ${PORT}`);
  });
});
