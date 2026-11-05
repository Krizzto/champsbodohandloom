// scripts/test_expertise_levels.mjs
// Comprehensive test runner for Basic vs Intermediate AI Docent expertise levels

const BASE_URL = 'http://localhost:3000/api/chat';

const TEST_QUESTIONS = [
  'What is spinning in Bodo handloom?',
  'What is the purpose of warping?',
  'Which tools are used in weaving?',
  'How are the different production stages connected?',
  'What is the significance of traditional motifs?',
  'What is Bluetooth according to the knowledge base?',
];

async function queryDocent(question, expertiseLevel) {
  const payload = {
    question,
    expertise: expertiseLevel,
    expertiseLevel: expertiseLevel,
  };

  const t0 = performance.now();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const durationMs = Math.round(performance.now() - t0);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return { ...data, durationMs };
}

async function runTestSuite() {
  console.log('='.repeat(80));
  console.log('BODO CULTURAL HERITAGE AI DOCENT — EXPERTISE LEVEL VERIFICATION TEST');
  console.log('='.repeat(80));

  const results = [];

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const question = TEST_QUESTIONS[i];
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`TEST ${i + 1}/6: "${question}"`);
    console.log(`--------------------------------------------------------------------------------`);

    // 1. Basic Mode
    const basicRes = await queryDocent(question, 'basic');
    console.log(`\n[BASIC MODE] (Time: ${basicRes.durationMs}ms | Returned Level: ${basicRes.expertiseLevel})`);
    console.log(basicRes.answer);
    console.log(`Citations: ${basicRes.sources?.length || 0} sources | InsufficientEvidence: ${Boolean(basicRes.insufficientEvidence)}`);

    // 2. Intermediate Mode
    const interRes = await queryDocent(question, 'intermediate');
    console.log(`\n[INTERMEDIATE MODE] (Time: ${interRes.durationMs}ms | Returned Level: ${interRes.expertiseLevel})`);
    console.log(interRes.answer);
    console.log(`Citations: ${interRes.sources?.length || 0} sources | InsufficientEvidence: ${Boolean(interRes.insufficientEvidence)}`);

    // Differentiator checks
    const isDistinct = basicRes.answer !== interRes.answer;
    const basicWordCount = basicRes.answer.split(/\s+/).length;
    const interWordCount = interRes.answer.split(/\s+/).length;

    console.log(`\nAnalysis: Distinct=${isDistinct} | Word count (Basic: ${basicWordCount}, Intermediate: ${interWordCount})`);

    results.push({
      question,
      basic: {
        answer: basicRes.answer,
        expertiseLevel: basicRes.expertiseLevel,
        wordCount: basicWordCount,
        sourcesCount: basicRes.sources?.length || 0,
        insufficientEvidence: basicRes.insufficientEvidence,
      },
      intermediate: {
        answer: interRes.answer,
        expertiseLevel: interRes.expertiseLevel,
        wordCount: interWordCount,
        sourcesCount: interRes.sources?.length || 0,
        insufficientEvidence: interRes.insufficientEvidence,
      },
      isDistinct,
    });
  }

  // Fallback test with invalid expertise level
  console.log(`\n--------------------------------------------------------------------------------`);
  console.log('FALLBACK TEST: Invalid expertiseLevel: "expert"');
  console.log(`--------------------------------------------------------------------------------`);
  const fallbackRes = await queryDocent('What is spinning in Bodo handloom?', 'expert');
  console.log(`Input: "expert" -> Returned expertise: "${fallbackRes.expertise}", expertiseLevel: "${fallbackRes.expertiseLevel}"`);
  console.log(`Is defaulted to basic: ${fallbackRes.expertise === 'basic' && fallbackRes.expertiseLevel === 'basic'}`);

  console.log('\n' + '='.repeat(80));
  console.log('ALL TESTS COMPLETED');
  console.log('='.repeat(80));
}

runTestSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
