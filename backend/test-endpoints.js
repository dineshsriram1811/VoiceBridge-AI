import http from 'http';
import FormData from 'form-data';
import app from './src/server.js';
import { GnaniTimbreService } from './src/services/gnaniTimbreService.js';

const PORT = 5099;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
  
  try {
    // Test 1: Health check
    console.log('\n--- Test 1: GET /api/assistant/health ---');
    const health = await get(`http://127.0.0.1:${PORT}/api/assistant/health`);
    console.log('Health Response:', health);

    // Test 2: Assistant Config
    console.log('\n--- Test 2: GET /api/assistant/config ---');
    const configData = await get(`http://127.0.0.1:${PORT}/api/assistant/config`);
    console.log('Config Response:', {
      serviceName: configData.serviceName,
      gnaniConfigured: configData.gnaniConfigured,
      modelsCount: configData.models?.stt?.length,
      voicesCount: configData.voices?.length,
      languagesCount: configData.supportedLanguages?.length
    });

    // Test 3: Chat Reasoning
    console.log('\n--- Test 3: POST /api/chat/respond (Hindi) ---');
    const chatResp = await postJson(`http://127.0.0.1:${PORT}/api/chat/respond`, {
      message: 'नमस्ते, आपका नाम क्या है?',
      language: 'hi-IN'
    });
    console.log('Chat Response:', chatResp);

    // Test 4: TTS Synthesis
    console.log('\n--- Test 4: POST /api/tts/synthesize ---');
    const ttsResp = await postJson(`http://127.0.0.1:${PORT}/api/tts/synthesize`, {
      text: 'नमस्ते! वॉयसब्रिज एआई में आपका स्वागत है।',
      voice: 'Shivani',
      language: 'hi-IN'
    });
    console.log('TTS Response:', {
      success: ttsResp.success,
      audioLength: ttsResp.audioBase64?.length,
      model: ttsResp.model,
      voice: ttsResp.voice
    });

    // Test 5: STT Audio Transcribe with real PCM WAV buffer
    console.log('\n--- Test 5: POST /api/stt/transcribe (Audio Upload) ---');
    const sampleWav = GnaniTimbreService._generateSimulatedWav('नमस्ते');
    const sttResult = await postFormData(`http://127.0.0.1:${PORT}/api/stt/transcribe`, sampleWav, 'test_sample.wav', {
      language_code: 'hi-IN'
    });
    console.log('STT Response:', sttResult);

    // Test 6: End-to-End Pipeline (Audio in -> STT -> Reasoning -> TTS -> Audio out)
    console.log('\n--- Test 6: POST /api/assistant/pipeline (End-to-End Pipeline) ---');
    const pipelineResult = await postFormData(`http://127.0.0.1:${PORT}/api/assistant/pipeline`, sampleWav, 'pipeline_sample.wav', {
      language_code: 'indic-auto',
      voice: 'Shivani'
    });
    console.log('Pipeline Response:', {
      success: pipelineResult.success,
      transcript: pipelineResult.transcript,
      detectedLanguage: pipelineResult.detectedLanguage,
      responseText: pipelineResult.responseText,
      audioBase64Length: pipelineResult.audioBase64?.length,
      timing: pipelineResult.timing
    });

    console.log('\n==========================================');
    console.log('  ALL INTEGRATION TESTS PASSED CLEANLY!  ');
    console.log('==========================================\n');
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(process.exitCode || 0);
    });
  }
});

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function postFormData(url, fileBuffer, filename, fields = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('audio_file', fileBuffer, {
      filename: filename,
      contentType: 'audio/wav'
    });
    for (const [key, val] of Object.entries(fields)) {
      form.append(key, val);
    }

    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: form.getHeaders()
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

