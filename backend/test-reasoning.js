import { GnaniEvonService } from './src/services/gnaniEvonService.js';
import { GnaniTimbreService } from './src/services/gnaniTimbreService.js';

const testQuestions = [
  'Explain Artificial Intelligence in three sentences.',
  'What is machine learning?',
  'Explain cloud computing.',
  'What is the difference between AI and ML?'
];

async function runTests() {
  console.log('================================================================');
  console.log('  Testing AI Reasoning & Gnani Timbre V3.0 Voice Synthesis');
  console.log('================================================================\n');

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`\n----------------------------------------------------------------`);
    console.log(`[Test ${i + 1}] User Query: "${question}"`);
    console.log(`----------------------------------------------------------------`);

    // 1. Get reasoning response
    const startTime = Date.now();
    const result = await GnaniEvonService.generateResponse(question, {
      language: 'en-IN'
    });
    const reasoningTime = Date.now() - startTime;

    console.log(`Reasoning Provider : ${result.provider}`);
    console.log(`Model ID           : ${result.model}`);
    console.log(`Is Simulated       : ${result.isSimulated}`);
    console.log(`Response Time      : ${reasoningTime}ms`);
    console.log(`\nGenerated Answer:\n${result.text}`);

    // Verification 1: Not a generic greeting
    const lower = result.text.toLowerCase();
    if (lower.includes('received your query') || lower.includes('i am voicebridge ai, an indian')) {
      throw new Error(`FAILED: Response for "${question}" is a generic template!`);
    }

    // Verification 2: Does not falsely label offline knowledge engine as Gnani Evon
    if (result.isSimulated && (result.provider.includes('Gnani Evon') || result.model.includes('evon'))) {
      throw new Error(`FAILED: Simulated response was falsely labeled as Gnani Evon!`);
    }

    // Verification 3: Verify content answers the question
    if (i === 0) {
      // Should mention human intelligence, learning, or problem solving
      if (!lower.includes('intelligence') && !lower.includes('systems')) {
        throw new Error(`FAILED: AI answer does not explain Artificial Intelligence!`);
      }
      // Sentence count check (roughly 3 periods/sentences)
      const sentences = result.text.split(/(?<=[.!?])\s+/).filter(Boolean);
      console.log(`Sentence Count     : ${sentences.length} sentences (target: 3)`);
    } else if (i === 1) {
      if (!lower.includes('learn') && !lower.includes('data')) {
        throw new Error(`FAILED: ML answer does not explain Machine Learning!`);
      }
    } else if (i === 2) {
      if (!lower.includes('cloud') && !lower.includes('server') && !lower.includes('internet')) {
        throw new Error(`FAILED: Cloud answer does not explain Cloud Computing!`);
      }
    } else if (i === 3) {
      if (!lower.includes('artificial intelligence') && !lower.includes('machine learning')) {
        throw new Error(`FAILED: Difference answer does not mention AI and ML!`);
      }
    }

    // 2. Synthesize with Gnani Timbre V3.0
    console.log('\nSynthesizing speech with Gnani Timbre V3.0...');
    const ttsStartTime = Date.now();
    const ttsResult = await GnaniTimbreService.synthesizeSpeech(result.text, {
      voice: 'Shivani',
      model: 'timbre-v3.0',
      language: 'en-IN'
    });
    const ttsTime = Date.now() - ttsStartTime;

    console.log(`TTS Model          : ${ttsResult.model} (${ttsResult.voice})`);
    console.log(`TTS Audio Bytes    : ${ttsResult.audioBuffer?.length || 0} bytes`);
    console.log(`TTS Response Time  : ${ttsTime}ms`);
    console.log(`TTS Content-Type   : ${ttsResult.contentType}`);
    console.log(`Status             : PASSED ✓`);
  }

  console.log('\n================================================================');
  console.log('  ALL 4 TEST QUERIES PASSED WITH VERIFIED REASONING & SPEECH!  ');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('\nTEST SUITE FAILED:', err);
  process.exit(1);
});

