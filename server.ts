import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure 'song' and 'public' directories exist
const songDir = path.join(process.cwd(), 'song');
if (!fs.existsSync(songDir)) {
  fs.mkdirSync(songDir, { recursive: true });
}

// Serve static assets from 'song' or 'public' directories if present
app.use('/song', express.static(songDir));
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));

// UPLOAD AUDIO API ENDPOINT
app.post("/api/upload-audio", (req, res) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: "No dataUrl provided" });
    }
    const safeName = (filename || `track_${Date.now()}.mp3`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const base64Data = dataUrl.replace(/^data: audio\/\w+;base64,/, '')
      .replace(/^data:video\/\w+;base64,/, '')
      .replace(/^data:application\/\w+;base64,/, '')
      .replace(/^data:[^;]+;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(songDir, safeName);
    fs.writeFileSync(filePath, buffer);

    console.log(`Successfully saved audio file: ${filePath} (${buffer.length} bytes)`);
    res.json({ success: true, audioUrl: `/song/${safeName}` });
  } catch (err: any) {
    console.error("Audio upload error:", err);
    res.status(500).json({ error: err.message || "Failed to save audio file" });
  }
});

// IN-MEMORY / DB PERSISTENT REST API LAYER
let songsList: any[] = [];

let golaRecipes = [
  {
    id: 'gola_1',
    name: 'Swarit Special Triple Blast',
    baseIce: 'crushed',
    flavours: [{ flavourId: 'kala_khatta', quantity: 3 }, { flavourId: 'mango', quantity: 2 }],
    toppings: ['tutti_frutti', 'sprinkles'],
    containerId: 'paper_cup',
    decorationId: 'mini_umbrella',
    songPlayedTitle: 'Gola & Chai Highway',
    createdAt: '2026-08-10',
    createdBy: 'user_1',
    createdByName: 'Swarit Shukla',
    likes: 42
  }
];

let feedbackList = [
  {
    id: 'fb_1',
    category: 'general',
    rating: 5,
    message: 'Love the night street aesthetic! The music sync with the glowing gola is incredible.',
    userName: 'Aman V.',
    status: 'reviewed',
    createdAt: '2026-08-09'
  }
];

// HEALTH CHECK API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Desi Barf Ka Gola" });
});

// SONGS ENDPOINTS
app.get("/api/songs", (req, res) => {
  res.json(songsList);
});

app.post("/api/songs", (req, res) => {
  const newSong = {
    id: `song_${Date.now()}`,
    playsCount: 0,
    likesCount: 0,
    ...req.body
  };
  songsList.push(newSong);
  res.status(201).json(newSong);
});

app.delete("/api/songs/:id", (req, res) => {
  const { id } = req.params;
  songsList = songsList.filter(s => s.id !== id);
  res.json({ success: true, id });
});

// GOLA RECIPES ENDPOINTS
app.get("/api/gola/recipes", (req, res) => {
  res.json(golaRecipes);
});

app.post("/api/gola/recipes", (req, res) => {
  const newRecipe = {
    id: `gola_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    ...req.body
  };
  golaRecipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// FEEDBACK ENDPOINTS
app.get("/api/feedback", (req, res) => {
  res.json(feedbackList);
});

app.post("/api/feedback", (req, res) => {
  const newFb = {
    id: `fb_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  feedbackList.push(newFb);
  res.status(201).json(newFb);
});

app.put("/api/feedback/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const fb = feedbackList.find(f => f.id === id);
  if (fb) {
    fb.status = status;
    res.json(fb);
  } else {
    res.status(404).json({ error: "Feedback not found" });
  }
});

// AUTH ENDPOINTS
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (email.includes('admin')) {
    res.json({
      id: 'admin_1',
      name: 'Desi Gola Admin',
      email: 'admin@desigola.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin'
    });
  } else {
    res.json({
      id: 'user_1',
      name: 'Swarit Shukla',
      email: 'user@desigola.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'user'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DESI BARF KA GOLA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
