import { GnaniTimbreService } from '../services/gnaniTimbreService.js';

export class TTSController {
  /**
   * Synthesize text to speech and return base64 audio and metadata
   */
  static async synthesize(req, res, next) {
    try {
      const { text, voice, model, language, speed } = req.body;

      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Text field is required for speech synthesis.'
        });
      }

      const result = await GnaniTimbreService.synthesizeSpeech(text, {
        voice,
        model,
        language,
        speed
      });

      return res.status(200).json({
        success: true,
        audioBase64: result.audioBase64,
        contentType: result.contentType,
        model: result.model,
        voice: result.voice,
        language: result.language,
        isSimulated: result.isSimulated,
        simulationNote: result.simulationNote
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stream raw WAV audio directly for native HTML5 <audio> tag
   */
  static async stream(req, res, next) {
    try {
      const { text, voice, model, language, speed } = req.query;

      if (!text || text.trim() === '') {
        return res.status(400).send('Text query param is required.');
      }

      const result = await GnaniTimbreService.synthesizeSpeech(text, {
        voice,
        model,
        language,
        speed: speed ? parseFloat(speed) : 1.0
      });

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', result.audioBuffer.length);
      return res.send(result.audioBuffer);
    } catch (error) {
      next(error);
    }
  }
}

