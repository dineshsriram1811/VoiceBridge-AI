/**
 * Language Detector for Indic scripts & English
 */
export function detectLanguage(text, defaultLang = 'en-IN') {
  if (!text || typeof text !== 'string') return defaultLang;
  
  const clean = text.trim();
  if (!clean) return defaultLang;

  // Unicode Indic Script ranges
  if (/[\u0900-\u097F]/.test(clean)) {
    // Devanagari: Hindi or Marathi
    return 'hi-IN';
  }
  if (/[\u0B80-\u0BFF]/.test(clean)) {
    // Tamil
    return 'ta-IN';
  }
  if (/[\u0C00-\u0C7F]/.test(clean)) {
    // Telugu
    return 'te-IN';
  }
  if (/[\u0C80-\u0CFF]/.test(clean)) {
    // Kannada
    return 'kn-IN';
  }
  if (/[\u0980-\u09FF]/.test(clean)) {
    // Bengali
    return 'bn-IN';
  }
  if (/[\u0A80-\u0AFF]/.test(clean)) {
    // Gujarati
    return 'gu-IN';
  }
  if (/[\u0A00-\u0A7F]/.test(clean)) {
    // Gurmukhi / Punjabi
    return 'pa-IN';
  }
  if (/[\u0D00-\u0D7F]/.test(clean)) {
    // Malayalam
    return 'ml-IN';
  }

  // Explicit keyword checks for English prompts requesting a language
  const lower = clean.toLowerCase();
  if (lower.includes('in hindi') || lower.includes('हिंदी में')) return 'hi-IN';
  if (lower.includes('in tamil') || lower.includes('தமிழில்')) return 'ta-IN';
  if (lower.includes('in telugu') || lower.includes('తెలుగులో')) return 'te-IN';
  if (lower.includes('in kannada') || lower.includes('ಕನ್ನಡದಲ್ಲಿ')) return 'kn-IN';
  if (lower.includes('in bengali') || lower.includes('বাংলায়')) return 'bn-IN';
  if (lower.includes('in marathi') || lower.includes('मराठीत')) return 'mr-IN';
  if (lower.includes('in gujarati') || lower.includes('ગુજરાતીમાં')) return 'gu-IN';

  // Default to English if Latin script
  if (/^[a-zA-Z0-9\s.,!?'"()_:+%/@#$*&^;/<>-]+$/.test(clean) || lower.includes('in english')) {
    return 'en-IN';
  }

  return defaultLang;
}

