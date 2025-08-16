const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT | 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  completed:{ type: Boolean, default: false },
});

const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/api/items', async (req, res) => {
   console.log('Search query:', req);
  try {
    const search = req.query.search;
    console.log('Search query:', search); 

    let filter = {};

    if (search) {
      filter = {
        name: { $regex: search, $options: 'i' }
      };
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (err) {
    console.error('Error in GET /api/items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  console.log(req.body)
  const newItem = new Item(req.body);
  const saved = await newItem.save();
  res.status(201).json(saved);
});

app.put('/api/items/:id', async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
