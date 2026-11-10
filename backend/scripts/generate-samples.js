import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GnaniTimbreService } from '../src/services/gnaniTimbreService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const samplesDir = path.resolve(__dirname, '../../samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

const sampleTexts = [
  { file: 'sample_hindi.wav', text: 'नमस्ते! वॉयसब्रिज एआई में आपका स्वागत है।', lang: 'hi-IN' },
  { file: 'sample_english.wav', text: 'Welcome to VoiceBridge AI, your Indian multilingual assistant.', lang: 'en-IN' },
  { file: 'sample_tamil.wav', text: 'வணக்கம்! வாய்ஸ்பிரிட்ஜ் ஏஐ உங்களை வரவேற்கிறது.', lang: 'ta-IN' },
  { file: 'sample_telugu.wav', text: 'నమస్కారం! వాయిస్ బ్రిడ్జ్ ఏఐకి స్వాగతం.', lang: 'te-IN' }
];

console.log('Generating sample audio WAV files in /samples directory...');

sampleTexts.forEach(({ file, text, lang }) => {
  const wavBuffer = GnaniTimbreService._generateSimulatedWav(text);
  const filePath = path.join(samplesDir, file);
  fs.writeFileSync(filePath, wavBuffer);
  console.log(`Created: ${file} (${wavBuffer.length} bytes)`);
});

console.log('Sample audio generation complete!');

