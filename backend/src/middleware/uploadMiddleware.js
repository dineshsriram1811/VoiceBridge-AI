import multer from 'multer';

// Use memory storage to stream audio buffers directly to Gnani APIs
const storage = multer.memoryStorage();

const audioFileFilter = (req, file, cb) => {
  // Allow common audio formats: wav, mp3, ogg, webm, flac, aac, m4a
  const allowedMimeTypes = [
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/mp3',
    'audio/mpeg',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'audio/x-flac',
    'audio/aac',
    'audio/m4a',
    'audio/mp4',
    'application/octet-stream' // sometimes sent by generic audio blobs
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(wav|mp3|ogg|webm|flac|aac|m4a)$/i)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio format: ${file.mimetype}. Allowed formats: WAV, MP3, OGG, WEBM, FLAC, AAC, M4A`), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max
  },
  fileFilter: audioFileFilter
});

