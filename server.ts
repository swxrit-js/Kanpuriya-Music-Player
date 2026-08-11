import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY / DB PERSISTENT REST API LAYER
let songsList = [
  {
    id: 'song_1',
    title: 'Gola & Chai Highway',
    artist: 'Raju & The Streetbeats',
    album: 'Monsoon Nights Vol. 1',
    duration: 214,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    genre: 'Desi Fusion',
    language: 'Hindi',
    mood: 'chill',
    lyrics: 'NIGHT TIME PAR CHAI AUR GOLA\nMera dil tu aake khola\nHighway ki hawa mein chill hai\nGola khake mood chill hai!',
    featured: true,
    trending: true,
    playsCount: 14200,
    likesCount: 3890
  },
  {
    id: 'song_2',
    title: 'Kala Khatta Groove',
    artist: 'DJ Desi Beats ft. Simran',
    album: 'Gola Party Anthems',
    duration: 188,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tropical-house-110008.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    genre: 'Punjabi Pop',
    language: 'Punjabi',
    mood: 'party',
    lyrics: 'Kala khatta vich thoda salt mila!\nBass bajao, speaker hilao!',
    featured: true,
    trending: true,
    playsCount: 28900,
    likesCount: 7120
  }
];

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

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`DESI BARF KA GOLA Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer();
