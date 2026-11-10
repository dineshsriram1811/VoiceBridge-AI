import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { upload } from '../middleware/uploadMiddleware.js';
import { STTController } from '../controllers/sttController.js';
import { TTSController } from '../controllers/ttsController.js';
import { ChatController } from '../controllers/chatController.js';
import { AssistantController } from '../controllers/assistantController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Assistant System & Config
router.get('/assistant/health', AssistantController.healthCheck);
router.get('/assistant/config', AssistantController.getConfig);

// Full end-to-end voice pipeline (Audio in -> STT -> LLM -> TTS -> Audio out)
router.post('/assistant/pipeline', upload.single('audio_file'), AssistantController.processVoicePipeline);

// Discrete Speech-to-Text (Gnani Prisma V3.0)
router.post('/stt/transcribe', upload.single('audio_file'), STTController.transcribe);

// Discrete Text-to-Speech (Gnani Timbre V3.0)
router.post('/tts/synthesize', TTSController.synthesize);
router.get('/tts/stream', TTSController.stream);

// Discrete Reasoning / Chat (Gnani Evon / LLM)
router.post('/chat/respond', ChatController.respond);

// Serve test audio samples for evaluation
router.get('/samples/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const samplePath = path.resolve(__dirname, '../../../samples', filename);
  if (fs.existsSync(samplePath)) {
    res.setHeader('Content-Type', 'audio/wav');
    return fs.createReadStream(samplePath).pipe(res);
  }
  return res.status(404).json({ error: 'Sample not found' });
});

export default router;

