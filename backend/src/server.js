import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRouter);

// Root greeting & status
app.get('/', (req, res) => {
  res.json({
    name: 'VoiceBridge AI Backend Server',
    description: 'Indian Multilingual AI Voice Assistant powered by Gnani AI Prisma, Timbre & Evon',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/assistant/config'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`
  });
});

import { fileURLToPath } from 'url';

// Centralized Error Handler
app.use(errorHandler);

const PORT = config.port || 5000;

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  VoiceBridge AI Backend is running on port ${PORT}`);
    console.log(`  Gnani AI Endpoint: ${config.gnaniBaseUrl}`);
    console.log(`  Gnani Prisma STT Model: ${config.prismaModel}`);
    console.log(`  Gnani Timbre TTS Model: ${config.timbreModel}`);
    console.log(`  Gnani API Key Configured: ${config.gnaniApiKey ? 'YES (Live)' : 'NO (Simulation mode)'}`);
    console.log(`  Evon Endpoint Configured: ${config.evonApiBaseUrl ? config.evonApiBaseUrl : 'Built-in Indic Engine'}`);
    console.log(`=======================================================`);
  });
}

export default app;
