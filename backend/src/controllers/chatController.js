import { GnaniEvonService } from '../services/gnaniEvonService.js';

export class ChatController {
  /**
   * Process text chat / query through reasoning model
   */
  static async respond(req, res, next) {
    try {
      const { message, language, history, systemPrompt } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Message field is required.'
        });
      }

      const result = await GnaniEvonService.generateResponse(message, {
        language: language || 'en-IN',
        history: Array.isArray(history) ? history : [],
        systemPrompt
      });

      return res.status(200).json({
        success: true,
        responseText: result.text,
        model: result.model,
        provider: result.provider,
        language: result.language,
        isSimulated: result.isSimulated,
        note: result.note
      });
    } catch (error) {
      next(error);
    }
  }
}

