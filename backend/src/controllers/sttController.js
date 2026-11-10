import { GnaniPrismaService } from '../services/gnaniPrismaService.js';

export class STTController {
  /**
   * Handle audio transcription request
   */
  static async transcribe(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided. Please record or upload an audio file.'
        });
      }

      const { language_code, model, format } = req.body;

      const result = await GnaniPrismaService.transcribeAudio(req.file, {
        language_code: language_code || 'indic-auto',
        model: model || 'prisma-v3.0',
        format: format || 'transcribe'
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

