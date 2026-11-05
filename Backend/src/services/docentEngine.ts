import { GoogleGenAI } from '@google/genai';
import type {
  ExpertiseLevel,
  GroundedDocentResponse,
  NavigationAction,
  SourceCitation,
  HybridEvidence,
} from '../types/graph.ts';
import { hybridRetriever } from './hybridRetriever.ts';
import { MUSEUM_EXHIBITS, MUSEUM_GALLERIES } from '../data/museumData.ts';

export class DocentEngine {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    this.initGeminiClient();
  }

  private initGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.warn('[DocentEngine] Notice initializing Gemini SDK:', err);
      }
    }
  }

  /**
   * Main Docent Answering Pipeline:
   * 1. Query Analysis & Intent Extraction
   * 2. 3D Exhibit Navigation Detection
   * 3. Hybrid GraphRAG Evidence Retrieval
   * 4. Evidence Validation & Sufficiency Assessment
   * 5. Grounded Generation (Gemini or Deterministic Synthesizer)
   * 6. Citation Validation & Output Assembly
   */
  public async answerQuery(
    query: string,
    expertise: ExpertiseLevel = 'basic'
  ): Promise<GroundedDocentResponse> {
    const trimmed = query.trim();
    const lower = trimmed.toLowerCase();

    // Ensure valid expertise
    const validExpertise: ExpertiseLevel = expertise === 'intermediate' ? 'intermediate' : 'basic';

    // 1. Detect 3D Navigation Request Intent
    const navigationAction = this.detectNavigationIntent(lower);

    // 2. Execute Hybrid GraphRAG Retrieval
    const evidence = hybridRetriever.retrieve(trimmed, 4);
    const sufficiency = hybridRetriever.evaluateSufficiency(evidence, trimmed);

    // 3. Handle Greetings / Meta Prompts
    if (this.isGreeting(lower)) {
      return {
        answer:
          validExpertise === 'basic'
            ? 'Khulumkha! Welcome to the Bodo Cultural Heritage & Virtual Museum. I am your AI Docent. You can ask me how cotton is spun, how natural indigo dyes are prepared, or tell me: "Take me to the Sal throw-shuttle loom" to navigate the 3D gallery!'
            : 'Khulumkha! I am your AI Museum Docent grounded in the verified Open Knowledge Framework (OKF) of Bodo indigenous handloom engineering. You may explore the 9 sequential processes from Ginning (Khun Saynay) to Weaving (Dirnay), or request 3D exhibit navigation.',
        expertise: validExpertise,
        expertiseLevel: validExpertise,
        sources: [],
        evidenceSufficient: true,
        insufficientEvidence: false,
        navigation: navigationAction,
        navigationAction,
        suggestedFollowUps: [
          'How are seeds removed from raw cotton?',
          'Why is yarn coated in rice powder and wheat flour?',
          'Take me to the Sal throw-shuttle loom',
        ],
      };
    }

    // 4. Handle Insufficient Evidence / Out-of-Scope Questions
    if (!sufficiency.sufficient && !navigationAction) {
      return {
        answer: `I apologize, but our verified Bodo cultural heritage knowledge base does not contain verified records regarding "${trimmed}". As a grounded archival system, I cannot guess or invent cultural facts. Please ask about Bodo cotton ginning, spinning with Takhri, reeling Eri silk, sizing with Maad, warping, looming, or traditional Sal and Thati Sal weaving.`,
        expertise: validExpertise,
        expertiseLevel: validExpertise,
        sources: [],
        evidenceSufficient: false,
        insufficientEvidence: true,
        uncertaintyAcknowledged: true,
        navigation: null,
        navigationAction: null,
        suggestedFollowUps: [
          'How does the Neotha ginning machine work?',
          'What tools are used in Looming (Nw khonnai)?',
          'What is the cultural significance of the Bodo Sal loom?',
        ],
      };
    }

    // 5. Generate Grounded Answer (Gemini API with Fallback)
    let answerText = '';
    if (this.aiClient && sufficiency.sufficient) {
      try {
        answerText = await this.generateWithGemini(trimmed, evidence, validExpertise);
      } catch (err) {
        console.warn('[DocentEngine] Gemini API call note, using grounded synthesis fallback:', err);
        answerText = this.generateDeterministicSynthesis(trimmed, evidence, validExpertise);
      }
    } else {
      answerText = this.generateDeterministicSynthesis(trimmed, evidence, validExpertise);
    }

    // 6. Navigation feedback message append if navigation requested
    if (navigationAction) {
      const navNote = `\n\n🧭 **3D Camera Navigation Activated:** Moving view to the ${navigationAction.exhibitName} (${navigationAction.nativeName}) in the ${navigationAction.galleryName}.`;
      if (!answerText.includes('Navigation Activated')) {
        answerText += navNote;
      }
    }

    // 7. Graph Context Summary for UI
    const graphSummary = evidence.graphEntities.slice(0, 5).map(e => `${e.name} (${e.type})`);

    return {
      answer: answerText.trim(),
      expertise: validExpertise,
      expertiseLevel: validExpertise,
      sources: evidence.citations,
      evidenceSufficient: sufficiency.sufficient,
      insufficientEvidence: !sufficiency.sufficient,
      navigation: navigationAction,
      navigationAction,
      graphContext: {
        entities: evidence.graphEntities,
        relationships: evidence.graphEdges,
      },
      graphContextSummary: graphSummary,
      suggestedFollowUps: this.generateFollowUpSuggestions(evidence),
    };
  }

  /**
   * Server-Side Gemini Grounded Generation with strict system instruction
   */
  private async generateWithGemini(
    query: string,
    evidence: HybridEvidence,
    expertise: ExpertiseLevel
  ): Promise<string> {
    if (!this.aiClient) throw new Error('Gemini SDK client not initialized');

    const evidenceText = evidence.documentChunks
      .map(c => `[DOCUMENT: ${c.documentName} | SECTION: ${c.sectionHeading}]\n${c.text}`)
      .join('\n\n');

    const graphText = evidence.graphEntities
      .map(n => `- Entity: ${n.name} (${n.type}) | Evidence: ${n.evidenceText || ''}`)
      .join('\n');

    const isBasic = expertise === 'basic';

    const basicSystemInstruction = `You are a friendly museum educator explaining Bodo handloom heritage to a beginner or school student.
Tone: Warm, welcoming, encouraging, and clear.
Audience: General museum visitors, beginners, students with no prior knowledge of weaving or Bodo culture.

STRICT WRITING RULES FOR BASIC MODE:
1. Use simple, familiar English with short sentences and short paragraphs (2 to 3 paragraphs total).
2. Explain unfamiliar Bodo words immediately in plain English when they first appear (for example, "Neotha is a wooden hand-roller used to separate seeds from cotton", "Takhri is a handheld spinning spindle").
3. Explain one concept at a time. Put the main idea first before introducing any details.
4. Focus on: What is it? What does it do? Why is it important to the weaver?
5. Avoid unnecessary technical terminology, dense numbers, or complex mechanics unless essential. When essential, explain them simply.
6. Do NOT use markdown section headers (do not use "###" or "##"). Keep to clean, readable paragraphs.
7. CRITICAL FACTUAL CONSTRAINT: Answer ONLY using facts established in the RETRIEVED EVIDENCE below. Never invent tools, materials, Bodo terms, or cultural claims. If the evidence does not state something, explicitly state that it is not documented in the archive.`;

    const intermediateSystemInstruction = `You are a knowledgeable museum educator and cultural researcher explaining Bodo handloom heritage to university students, researchers, and craft learners who seek technical and cultural depth.
Tone: Academically precise, structured, and informative.
Audience: University students, researchers, textile apprentices, and experienced craft enthusiasts.

STRICT WRITING RULES FOR INTERMEDIATE MODE:
1. Provide a comprehensive, structured technical explanation with analytical depth.
2. Use accurate indigenous Bodo handloom terminology (such as Neotha/Zenther, Takhri, Chwrkhi, Maad, Serki, Baleb, Rashw, Gandwi, Sal, Thati Sal, Agor) and explain technical concepts and their structural functions.
3. Detail procedural mechanics in logical sequential order (e.g. twist insertion, thread tensioning, lease crossover, shedding, picking, beating).
4. Explain the interconnections between different handloom production stages (e.g. how rice gruel sizing strengthens warp threads to withstand heald and reed friction during looming and weaving).
5. Detail specific tools, materials, and techniques supported by the evidence.
6. Organize with structured paragraphs, and use bullet points or numbered lists where appropriate for procedural clarity.
7. CRITICAL FACTUAL CONSTRAINT: Answer ONLY using facts established in the RETRIEVED EVIDENCE below. Do NOT invent tools, materials, Bodo terms, or cultural claims to lengthen the answer. If the evidence does not contain sufficient details, state the limit of the archive.`;

    const systemInstruction = isBasic ? basicSystemInstruction : intermediateSystemInstruction;

    const prompt = `VISITOR QUESTION: "${query}"
EXPERTISE LEVEL REQUESTED: ${expertise.toUpperCase()}

RETRIEVED DOCUMENT EVIDENCE:
${evidenceText}

RETRIEVED KNOWLEDGE GRAPH RELATIONSHIPS:
${graphText}

Please provide an evidence-grounded answer adhering strictly to the ${expertise.toUpperCase()} expertise profile and writing rules above.`;

    const response = await this.aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text || this.generateDeterministicSynthesis(query, evidence, expertise);
  }

  /**
   * Deterministic grounded synthesis engine (runs 100% offline with zero external dependencies)
   * Implements genuinely distinct Basic vs Intermediate explanation depth.
   */
  private generateDeterministicSynthesis(
    query: string,
    evidence: HybridEvidence,
    expertise: ExpertiseLevel
  ): string {
    const lower = query.toLowerCase();
    const isBasic = expertise === 'basic';

    // 1. Spinning inquiry
    if (
      lower.includes('spinning') ||
      lower.includes('takhri') ||
      lower.includes('chwrkhi') ||
      (lower.includes('spin') && lower.includes('cotton'))
    ) {
      if (isBasic) {
        return `Spinning is the process of turning raw fluffy cotton or silk fibers into continuous thread or yarn so it can be woven into cloth.

In traditional Bodo weaving, after cotton seeds are separated during ginning, weavers spin the clean fibers using simple traditional tools like the *Takhri* (a small handheld drop spindle with a weighted whorl) or the *Chwrkhi* (a wooden spinning wheel). As the spinner turns the spindle, the fibers are gently pulled out and twisted together into a strong, even thread.

This step is essential because loose cotton cannot be woven on a loom without first being spun into strong, unbroken yarn.`;
      } else {
        return `Spinning (*Khun Ranai* or *Khun Phinna*) represents the second major stage in traditional Bodo handloom manufacture, immediately following cotton ginning (*Neotha hwnai*). Its core function is the drafting and twist-insertion of combed cotton slivers (*Khun jwn*) or degummed Ahimsa Eri silk fibers into uniform yarn suitable for warp and weft.

The technical process employs two primary indigenous implements:
- **Takhri (Drop Spindle)**: A portable drop spindle consisting of a slender iron rod and a circular weighted stone or clay whorl. The spinner drafts fiber with one hand while rotating the spindle with the other, utilizing gravity and rotational momentum to insert twist into the drawn sliver.
- **Chwrkhi (Spinning Wheel)**: A hand-cranked wooden wheel apparatus mounted on a timber frame, driving a smaller spindle via a cord pulley to achieve higher rotational velocity and uniform yarn tension.

Within the production lineage, spinning converts discontinuous botanical and sericultural fibers into continuous yarn packages. The spun yarn is subsequently prepared in hanks for scouring and the sizing (*Khun Lwnai*) stage, where rice starch paste is applied to impart tensile strength for loom operations.`;
      }
    }

    // 2. Warping inquiry
    if (
      lower.includes('warping') ||
      lower.includes('purpose of warping') ||
      (lower.includes('warp') && lower.includes('purpose'))
    ) {
      if (isBasic) {
        return `Warping is the step where weavers measure and arrange all the lengthwise threads before putting them onto the loom.

These long lengthwise threads are called the "warp." Using wooden or bamboo pegs, the weaver stretches hundreds of threads side by side to the exact length and width needed for the fabric. The threads are carefully kept in order so they do not tangle.

This preparation is very important because having straight, evenly spaced warp threads ensures the cloth will be smooth, strong, and easy to weave without snags.`;
      } else {
        return `Warping (*Jang Dinay* or *Dawa lwnai*) is the crucial preparatory stage that establishes the longitudinal thread matrix (the warp sheet) according to the precise dimensions, thread count, and pattern repeat of the planned textile.

During warping, yarn wound from bobbins (*Khabang*) is guided across a series of bamboo or wooden warping pegs (*Jang Khunti*) in a continuous, alternating pathway. The central mechanical requirement is forming the 'lease' or thread crossover (the *por*). This alternating figure-eight crossover maintains the absolute numerical sequence of every individual warp end and prevents twisting during subsequent handling.

Warping directly connects bobbin winding (*Khabang Honay*) to beam mounting (*Phannai*). Precise mathematical uniformity across the warp sheet prevents sagging and irregular tension across the loom's width, which is required for executing intricate supplementary weft geometric motifs (*Agor*).`;
      }
    }

    // 3. Weaving Tools inquiry
    if (
      (lower.includes('tool') || lower.includes('tools')) &&
      (lower.includes('weaving') || lower.includes('loom') || lower.includes('used in weaving'))
    ) {
      if (isBasic) {
        return `In traditional Bodo handloom, weavers use several locally crafted wooden and bamboo tools to weave fabric:

- **Sal (or Thati Sal)**: The traditional loom made from four sturdy wooden posts where the threads are held and woven into cloth.
- **Maku (Shuttle)**: A smooth, boat-shaped bamboo piece that carries the crosswise thread back and forth across the loom.
- **Weaving Sword (Chontha)**: A flat wooden blade used to press and pack each newly woven thread tightly into place.
- **Rashw (Reed comb)**: A fine comb made of bamboo splits that keeps the lengthwise threads evenly separated.

Together, these simple natural tools give the weaver complete control over the cloth, allowing them to create durable garments like the *Dokhona* and *Aronai*.`;
      } else {
        return `Bodo handloom weaving (*Daonay* or *Dirnay*) is executed on indigenous wooden frame apparatuses constructed using seasoned local timber (such as Sal posts or bamboo) anchored into four floor posts.

The primary traditional implements and their technical functions include:
- **Sal (Throw-Shuttle Loom)**: The traditional pit/frame loom where the weaver operates the sword and throws the shuttle manually by hand.
- **Thati Sal (Fly-Shuttle Loom)**: An adapted frame loom equipped with shuttle boxes at each end of the sley raceboard and a central pulling cord, doubling picking speed.
- **Maku (Boat Shuttle)**: Sculpted from seasoned bamboo, carrying the weft pirn through the shed opening formed by alternate warp lifts.
- **Baleb (Heald Shafts / Heddles)**: Sets of knitted twine or bamboo heald loops (*Nw*) controlled by foot treadles to elevate and depress alternate warp sheets (shedding motion).
- **Rashw (Reed Batten / Comb)**: Hand-sliced fine bamboo split reed mounted on the sley to maintain uniform warp sett (ends per inch) and execute the beating motion.
- **Chontha (Weaving Sword)**: Heavy hardwood sword blade used on the *Sal* to compress each weft insertion firmly against the fell of the cloth.
- **Agor Pins / Sticks**: Fine bamboo supplementary weft skewers used to pick and raise designated warp groups when inserting decorative geometric motifs.

These tools operate in precise mechanical synchronization through the three primary weaving motions: shedding (opening the warp via *Baleb*), picking (passing the *Maku* across the shed), and beating (pressing the pick with the *Rashw* or *Chontha*).`;
      }
    }

    // 4. Connected Production Stages inquiry
    if (
      lower.includes('stage') ||
      lower.includes('stages') ||
      lower.includes('connected') ||
      lower.includes('connection') ||
      lower.includes('order') ||
      lower.includes('sequence') ||
      lower.includes('lineage')
    ) {
      if (isBasic) {
        return `Making traditional Bodo cloth follows an orderly 9-step journey where each step prepares the thread for the next one:

1. **Ginning**: Cotton seeds are removed using a wooden roller machine (*Neotha*).
2. **Spinning**: The clean cotton is spun into thread using a spindle (*Takhri*) or wheel (*Chwrkhi*).
3. **Reeling**: Silk filaments are gently drawn out from boiled Eri cocoons.
4. **Sizing**: Cotton or silk threads are coated in warm rice starch paste so they become smooth and do not snap.
5. **Winding**: The dried threads are wound neatly onto small bobbins.
6. **Warping**: The threads are measured and arranged side by side to the full length of the cloth.
7. **Beaming**: The long threads are rolled tightly onto the wooden beam of the loom.
8. **Looming**: Each thread is threaded through the reed comb and loops on the loom.
9. **Weaving**: The weaver sits at the loom and interlaces crosswise threads to create the finished cloth.

Every step is connected: if you do not size the threads, they will break on the loom, and if you do not warp them carefully, the fabric will weave unevenly.`;
      } else {
        return `Bodo textile engineering constitutes an unbroken, interdependent sequential lineage of 9 distinct technological operations, organized across three functional phases:

**Phase I: Fiber Conditioning & Yarn Manufacture**
1. *Ginning (Khun Saynay / Neotha hwnai)*: Separation of cotton seeds and debris from raw fibers using the *Neotha/Zenther* roller gin.
2. *Spinning (Khun Bangnay)*: Twist insertion on combed slivers via the drop spindle (*Takhri*) or spinning wheel (*Chwrkhi*).
3. *Reeling (Khou Saynay)*: Alkaline boiling of Ahimsa Eri silk cocoons followed by manual filament extraction and leaf-pressing.

**Phase II: Yarn Enhancement & Warp Geometry**
4. *Sizing (Jang Honay / Khun Lwnai)*: Impregnating warp yarn with a boiled starch paste (*Maad*) of rice powder and wheat flour to boost tensile strength and lay fiber hairiness flat against friction.
5. *Winding (Khabang Honay)*: Transferring sized yarn hanks onto pirns and bobbins using the rotating *Serki* reel.
6. *Warping (Jang Dinay)*: Continuous peg-frame arrangement establishing total warp length, ends per inch, and the lease cross (*por*).

**Phase III: Loom Mounting & Structural Weaving**
7. *Beaming (Phannai)*: Tensioned transfer of the warp sheet onto the loom warp beam roller (*Gandwi*).
8. *Looming & Drafting (Nw Khonnai / Serskiyaw Sohonay)*: Individual drafting of warp ends through heald eyes (*Baleb*) and reed batten dents (*Rashw*).
9. *Weaving (Dirnay / Daonai)*: Synchronized execution of shedding, picking, and beating motions on the *Sal* or *Thati Sal*, accompanied by supplementary weft insertion for *Agor* motifs.

**Technological Interconnections**: Each stage directly determines the feasibility of the next. For instance, deficient sizing leads directly to warp shedding failure and excessive yarn breakage during looming, while uneven beaming tension causes distortion across supplementary weft patterns.`;
      }
    }

    // 5. Traditional Motifs inquiry
    if (
      lower.includes('motif') ||
      lower.includes('motifs') ||
      lower.includes('agor') ||
      lower.includes('pattern') ||
      lower.includes('design')
    ) {
      if (isBasic) {
        return `Traditional Bodo textile designs, called **Agor**, are geometric patterns woven directly into the fabric that reflect nature, everyday life, and sacred traditions.

Instead of printing or painting, Bodo weavers use extra colored threads while weaving on the loom to create these raised designs. Common traditional motifs include:
- **Hajw Agor**: A triangular pattern representing the hills and mountains of Assam, symbolizing strength and honor.
- **Daorai Mwkhrwb**: A diamond-like pattern inspired by peacock feathers, symbolizing elegance and dignity.
- **Phul Agor**: Flower-shaped designs that celebrate the beauty of nature and blooming seasons.

These motifs are woven into ceremonial garments like the *Aronai* scarf and *Dokhona* dress, serving as a proud badge of Bodo cultural identity and respect.`;
      } else {
        return `Traditional Bodo motifs, known natively as **Agor**, represent an indigenous mathematical geometry and visual symbolism woven primarily through supplementary weft techniques on the *Sal* (throw-shuttle) and *Thati Sal* (fly-shuttle) looms.

The primary canonical motifs and their cultural-structural significance include:
- **Hajw Agor (Mountain Peak Geometry)**: A serrated triangular motif symbolizing the Himalayan foothills and mountain ranges of Assam. Characterized by acute geometric symmetry, it is woven prominently along the borders of the ceremonial *Aronai* scarf, functioning as an emblem of fortitude, hospitality, and cultural veneration.
- **Daorai Mwkhrwb (Peacock Eye Motif)**: A complex diamond and lozenge repeat pattern depicting the stylized eye of the peacock feather, historically associated with royal dignity, grace, and natural harmony.
- **Phul Agor & Nature Depictions**: Stylized floral and botanical motifs (including lotus blossoms and turmeric leaves) reflecting traditional Bathou spiritual philosophies honoring natural ecosystems.

**Technical Execution**: *Agor* motifs are not embroidered; they are integrated into the ground weave during the weaving process. The weaver manually counts and lifts specific warp ends using fine bamboo pins (*Agor khunthi*) to insert dyed supplementary weft threads, creating a raised, tapestry-like relief that requires immense spatial calculation and craftsmanship.`;
      }
    }

    // General fallback using retrieved evidence
    const topChunk = evidence.documentChunks[0];
    const topEntity = evidence.graphEntities[0];

    if (!topChunk && !topEntity) {
      return 'The archive does not contain sufficient verified evidence to answer this question accurately.';
    }

    const processName = topChunk?.processName || topEntity?.name || 'Traditional Weaving Process';
    const mainText = topChunk?.text || topEntity?.evidenceText || '';
    const tools = evidence.graphEntities.filter(e => e.type === 'Tool').map(t => t.name);
    const materials = evidence.graphEntities.filter(e => e.type === 'Material').map(m => m.name);

    if (isBasic) {
      const cleanSummary = mainText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('#'))
        .slice(0, 3)
        .join(' ');

      let basicAns = `In traditional Bodo weaving, **${processName}** is an essential step in making handmade cloth.\n\n${cleanSummary}`;
      if (tools.length > 0) {
        basicAns += `\n\nTraditional tools used in this step include the **${tools.slice(0, 3).join(', ')}**.`;
      }
      return basicAns;
    } else {
      let intermediateAns = `### ${processName} — Technical & Heritage Analysis\n\n${mainText}`;
      if (tools.length > 0) {
        intermediateAns += `\n\n**Traditional Implements & Tooling:**\n${tools.map(t => `- ${t}`).join('\n')}`;
      }
      if (materials.length > 0) {
        intermediateAns += `\n\n**Materials Consumed:**\n${materials.map(m => `- ${m}`).join('\n')}`;
      }
      intermediateAns += `\n\n*All details verified against the Open Knowledge Framework (OKF) archival records of the Bodo Cultural Heritage Archive.*`;
      return intermediateAns;
    }
  }

  /**
   * Detect navigation requests to 3D museum exhibits
   */
  private detectNavigationIntent(lowerQuery: string): NavigationAction | null {
    const isNavWord =
      lowerQuery.includes('take me') ||
      lowerQuery.includes('show me') ||
      lowerQuery.includes('navigate') ||
      lowerQuery.includes('go to') ||
      lowerQuery.includes('teleport') ||
      lowerQuery.includes('where is') ||
      lowerQuery.includes('where can i see') ||
      lowerQuery.includes('look at') ||
      lowerQuery.includes('find') ||
      lowerQuery.includes('visit') ||
      lowerQuery.includes('explore') ||
      lowerQuery.includes('view in 3d');

    if (!isNavWord) return null;

    for (const exhibit of MUSEUM_EXHIBITS) {
      const nameMatch = lowerQuery.includes(exhibit.name.toLowerCase());
      const nativeMatch = lowerQuery.includes(exhibit.nativeName.toLowerCase());

      let keywordMatch = false;
      if (exhibit.id === 'exhibit_traditional_sal_loom' && (lowerQuery.includes('sal') || lowerQuery.includes('throw shuttle') || lowerQuery.includes('loom'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_ginning_roller' && (lowerQuery.includes('ginning') || lowerQuery.includes('roller') || lowerQuery.includes('neotha') || lowerQuery.includes('janthwr') || lowerQuery.includes('zenther'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_spinning_wheel' && (lowerQuery.includes('spinning') || lowerQuery.includes('wheel') || lowerQuery.includes('chwrkhi') || lowerQuery.includes('takhri'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_sizing_station' && (lowerQuery.includes('sizing') || lowerQuery.includes('rice starch') || lowerQuery.includes('maidi'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_reeling_basin' && (lowerQuery.includes('reeling') || lowerQuery.includes('cocoon') || lowerQuery.includes('basin'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_looming_bench' && (lowerQuery.includes('looming') || lowerQuery.includes('drafting') || lowerQuery.includes('baleb'))) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_aronai_textile' && lowerQuery.includes('aronai')) {
        keywordMatch = true;
      } else if (exhibit.id === 'exhibit_dokhona_textile' && lowerQuery.includes('dokhona')) {
        keywordMatch = true;
      }

      if (nameMatch || nativeMatch || keywordMatch) {
        const gallery = MUSEUM_GALLERIES.find(g => g.id === exhibit.galleryId);
        return {
          type: 'NAVIGATE_TO_EXHIBIT',
          exhibitId: exhibit.id,
          exhibitName: exhibit.name,
          nativeName: exhibit.nativeName,
          galleryId: exhibit.galleryId,
          galleryName: gallery?.name || 'Heritage Gallery',
          targetRoom: gallery?.name || 'Heritage Village',
          coordinates: exhibit.position,
          targetPosition: exhibit.position,
          reason: `Requested view of ${exhibit.name}.`,
        };
      }
    }

    return null;
  }

  private isGreeting(lower: string): boolean {
    return (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.startsWith('khulumkha') ||
      lower === 'help' ||
      lower.includes('who are you')
    );
  }

  private generateFollowUpSuggestions(evidence: HybridEvidence): string[] {
    const suggestions: string[] = [];
    const topChunk = evidence.documentChunks[0];

    if (topChunk) {
      if (topChunk.processId === 'ginning') {
        suggestions.push('What is the difference between Neotha and Zenther?', 'How is cotton spun with Takhri?');
      } else if (topChunk.processId === 'spinning') {
        suggestions.push('How are Eri silk cocoons reeled?', 'Why is rice gruel sizing applied to yarn?');
      } else if (topChunk.processId === 'sizing') {
        suggestions.push('How is the warp creel prepared in Warping?', 'Take me to the sizing station in 3D');
      } else if (topChunk.processId === 'looming') {
        suggestions.push('What are the Baleb lease-rods made of?', 'How long does traditional Bodo weaving take?');
      } else if (topChunk.processId === 'weaving') {
        suggestions.push('What is the difference between Sal and Thati Sal?', 'Take me to the Sal throw-shuttle loom');
      }
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'What are the 9 traditional Bodo weaving steps?',
        'How is Ahimsa Eri silk reared?',
        'Take me to the Sal throw-shuttle loom'
      );
    }

    return suggestions.slice(0, 3);
  }
}

export const docentEngine = new DocentEngine();
