import { ExpertiseLevel } from '../utils/constants';

export interface KnowledgeResponse {
  answer: string;
  sources: string[];
}

interface TopicKnowledge {
  keywords: string[];
  basic: string;
  intermediate: string;
  sources: string[];
}

const KNOWLEDGE_BASE: TopicKnowledge[] = [
  {
    keywords: ['bodo handloom', 'what is bodo handloom', 'handloom heritage', 'handloom', 'weaving tradition'],
    basic: `**Bodo handloom** is an ancient, living textile tradition practiced by the indigenous **Bodo community** of Northeast India, centered in Bodoland (Assam).

Key highlights:
• **Matrilineal Craft**: Traditionally passed from mother to daughter across generations, where weaving skill signifies cultural pride and dignity.
• **Sacred Fibers**: Renowned for handspun **Ahimsa Eri silk** (peace silk) and soft organic cotton.
• **Distinctive Attire**: Produces iconic garments including the **Dokhona** (draped women's attire) and **Aronai** (ceremonial scarf of honor).`,
    intermediate: `**Bodo handloom** represents an advanced ethno-technological weaving system characterized by throw-shuttle and fly-shuttle pit and frame looms without mechanical dobby/jacquard attachments.

Cultural and technical dimensions:
• **Sacred Geometry (Agor)**: Weavers execute supplementary-weft motifs directly on the warp through memorized mathematical counts of threads.
• **Ahimsa Sericulture**: Pioneers the non-violent rearing of *Samia ricini* (Eri silkworm), where the moth emerges naturally through an open-ended cocoon before degumming.
• **Loom Architecture**: Built from local seasoned bamboo and timber (*Tanth* / *Sal*), harmonized with village agrarian rhythms and seasonal festivals like Bwisagu.
• **Socio-Cultural Role**: Historically, every Bodo home maintains a dedicated weaving corner (*Agor Khali*), signifying household self-reliance and artistic sovereignty.`,
    sources: [
      'Material Culture of the Bodo Community (Dr. B. K. Daimary)',
      'Traditional Textiles and Loom Implements of Bodoland (TRI Assam)'
    ]
  },
  {
    keywords: ['traditional weaving tools', 'weaving tools', 'tools', 'loom tools', 'what are the traditional weaving tools'],
    basic: `Traditional Bodo weaving employs handcrafted tools made primarily from seasoned local bamboo, cane, and indigenous timber:

• **Maku (Weaving Shuttle)**: A boat-shaped shuttle carrying weft bobbins through the warp shed.
• **Zenther (Roller Gin)**: A dual-roller wooden gin that pinches cotton lint away from seeds.
• **Takhri (Drop Spindle)**: A balanced spindle used to spin clean fiber slivers into continuous thread.
• **Chorkhi / Swift**: A revolving cane frame used to wind and tension skeins of yarn.
• **Gondwi / Reed Beater**: A smooth bamboo comb used to pack the weft picks tightly.`,
    intermediate: `The Bodo loom ensemble represents centuries of ergonomic tool crafting utilizing seasoned *Bambusa tulda* and *Melocanna baccifera*:

• **Maku (माकु)**: Streamlined boat shuttle shaped from ironwood or dense bamboo, oiled with beeswax to minimize friction across fine Eri warps.
• **Zenther (खुन सायनाय)**: Precision hand-cranked hardwood cylinder gin designed to extract cotton fibers without crushing the seed husk or shearing staple length.
• **Takhri (तखरी)**: Drop spindle with a terracotta or horn whorl providing calibrated angular momentum for spinning high-twist yarn.
• **Maad Sizing Kit**: Stiff palm-fiber brushes paired with a carved wooden trough for applying warm boiled rice starch to reinforce warp tension.
• **Lease Rods & Heddles (Bwo)**: Suspended through cane pulleys to separate upper and lower warp layers for complex supplementary Agor designs.`,
    sources: [
      'Traditional Textiles and Loom Implements of Bodoland (Assam Heritage Registry)',
      'Bodoland Museum Tool Accession Archives'
    ]
  },
  {
    keywords: ['zenther', 'what is zenther', 'ginning', 'cotton gin', 'khun saynay'],
    basic: `**Zenther** (or *Khun Saynay*) is the traditional Bodo hand-operated wooden roller gin used for cotton seed separation.

Key details:
• **Function**: Separates raw cotton seeds from fluffy lint fibers without damaging the delicate natural fibers.
• **Craftsmanship**: Built from two counter-rotating hardwood rollers mounted onto a sturdy wooden base.
• **Cultural Role**: Operates as Stage 1 in the traditional 9-stage textile creation workflow, traditionally celebrated after the autumn harvest.`,
    intermediate: `**Zenther** is an indigenous mechanical roller gin engineering innovation preserved across Bodoland villages:

Technical and cultural significance:
• **Mechanics**: Features two tight-tolerance, counter-rotating cylinders driven by a hand crank. When raw seed-cotton is fed between the rollers, the narrow gap pulls the soft fibers through while rejecting the hard seeds intact.
• **Fiber Preservation**: Unlike modern abrasive saw gins, the Zenther exerts gentle frictional shear, preserving natural staple length and elasticity for subsequent drop-spindle drafting.
• **Workflow Position**: Serves as Stage 1 of the Bodo textile cycle, followed by carding and spindle spinning (*Takhri*).
• **Courtyard Tradition**: Community ginning sessions during dry winter months foster communal storytelling and folk music among elder and apprentice weavers.`,
    sources: [
      'Processes of Traditional Bodo Weaving (Assam Heritage Studies, Vol. 1)',
      'Material Culture of the Bodo Community'
    ]
  },
  {
    keywords: ['motifs', 'bodo handloom motifs', 'common bodo handloom motifs', 'agor', 'what are common bodo handloom motifs', 'patterns'],
    basic: `Bodo handloom motifs are called **Agor** (meaning "design" or "pattern" in the Bodo language). They draw direct inspiration from nature, spiritual beliefs, and village landscapes:

• **Hajw Agor**: Triangular mountain and hill peaks symbolizing ancestral landscapes and spiritual strength.
• **Daorai Agor**: The peacock motif, representing beauty, vigilance, and marital celebration.
• **Phul Agor**: Stylized wild blossom motifs celebrating nature's bounty and renewal.
• **Singri Agor**: A diamond-lattice motif representing balance and harmony.`,
    intermediate: `**Agor** constitutes the sacred visual language of the Bodo people, executed through counted supplementary-weft embroidery (*pick-and-pick* technique) directly on the loom:

Key motifs and cultural semantics:
• **Hajw Agor (हाजो आगर)**: Step-pyramidal chevron motifs representing the sacred hills of Bodoland and the eternal cosmic axis of Bathouism.
• **Daorai Mwkhreb (दाउरै मोख्रेब)**: Stylized peacock-crest geometry symbolizing nobility, dignity, and auspicious ceremonial gatherings.
• **Gongar Do-Khona (गंगar)**: Interlocking diamond lozenges referencing the mythical tortoise and the balance of water and earth.
• **Muphur Apha**: The bear footprint motif, depicting respectful coexistence with sub-Himalayan forest wildlife.
• **Agor Gendrwi**: Continuous wave or zigzag motifs representing flowing rivers and perpetual renewal.`,
    sources: [
      'Sacred Agor Geometry (Bodo Sahitya Sabha Research Wing)',
      'Traditional Textiles and Loom Implements of Bodoland'
    ]
  },
  {
    keywords: ['dokhona', 'dokhona thaosi', 'traditional dress', 'garment', 'women dress'],
    basic: `The **Dokhona** is the iconic traditional attire worn by Bodo women, draped gracefully from the chest down to the ankles.

Key points:
• **Dokhona Thaosi**: Denotes an intricately ornamented heirloom garment with dense border and field motifs.
• **Colors**: Rich natural saffron-yellow (*Thaosi* yellow), earthy madder reds, and vibrant borders.
• **Significance**: Worn during daily village life as well as solemn festivals, symbolizing feminine dignity, modesty, and Bodo identity.`,
    intermediate: `The **Dokhona** is an unstitched rectangular textile (approximately 280 cm × 115 cm) wrapped once around the upper torso, tucked over the left shoulder or under the arms, and secured around the waist.

Technical and cultural nuances:
• **Classification**: Differentiated between **Dokhona Salamatha** (plain or lightly bordered everyday garment) and **Dokhona Thaosi** (richly ornamented heirloom piece featuring supplementary weft Agor across borders and anchal).
• **Symbolic Colorimetry**: The signature yellow hue (*Haldi* / turmeric) evokes warmth and reverence for the sun and agricultural prosperity in Bathou philosophy.
• **Weft Density**: High-count cotton or peace Eri silk yarns ensure exceptional drape, breathability, and thermal comfort across tropical and sub-Himalayan seasons.`,
    sources: [
      'Bodo Women and the Loom: Gender, Space and Cultural Expression (N. Brahma)',
      'Textiles of the Bodo Community (TRI Assam)'
    ]
  },
  {
    keywords: ['aronai', 'scarf', 'shawl', 'ceremonial scarf', 'cultural gift'],
    basic: `The **Aronai** is a small, sacred ceremonial scarf that holds immense cultural reverence among the Bodo people.

Key aspects:
• **Symbol of Respect**: Given as a mark of highest honor and welcome to guests, elders, and distinguished visitors.
• **Design**: Woven with geometric Agor motifs (especially Hajw Agor) at both fringed ends.
• **Use**: Worn around the neck during cultural celebrations, dance performances, and traditional weddings.`,
    intermediate: `The **Aronai** is a compact ceremonial muffler/scarf (measuring approximately 180–200 cm × 25–30 cm) serving as the quintessential badge of Bodo hospitality, honor, and fraternity.

Structural characteristics:
• **Supplementary Weft End-Borders**: Embellished with step-pyramid *Hajw Agor* patterns woven in vibrant scarlet, black, and gold silk threads on a crisp cotton or Eri ground.
• **Ritual Protocol**: Presented during the *Bwisagu* spring festival, peace assemblies, and scholastic felicitations.
• **Identity Emblem**: Recognized across Northeast India as an evocative emblem of indigenous autonomy, communal dignity, and mutual respect.`,
    sources: [
      'Material Culture of the Bodo Community',
      'Folklore and Textiles of Assam'
    ]
  },
  {
    keywords: ['natural dyes', 'dyes', 'dyeing', 'botanical dyes', 'colors', 'materials'],
    basic: `Bodo weavers possess a rich tradition of **natural botanical dyeing**, using wild herbs, roots, leaves, and bark gathered from local forests:

• **Turmeric & Jackfruit Bark**: Produces radiant yellow-gold shades.
• **Indigo (Kala-Rong)**: Yields deep natural blues and dark accents.
• **Madder & Lac**: Extracts rich reds, terracotta, and warm brown tones.
• **Banana Ash Water**: Used as a natural alkaline mordant to fix and brighten colors.`,
    intermediate: `Bodo botanical dyeing represents an indigenous chemical ecology characterized by non-toxic mordanting and slow fermentation baths:

Formulations and Mordanting:
• **Alkaline Lye (Khar)**: Filtered cold water extract of sun-dried burnt banana pseudo-stem ash (*Balabari Khar*), acting as a gentle alkaline fixative.
• **Direct and Vat Dyeing**: Leaves of *Strobilanthes cusia* (indigenous wild indigo) fermented in clay vats with rice beer yeast to reduce indigotin.
• **Tannin-Rich Woods**: Decoctions of *Acacia catechu* (cutch) and *Rubia cordifolia* (madder root) provide colorfast earth tones resistant to UV degradation.
• **Eco-Harmony**: Complete avoidance of synthetic petrochemical salts, protecting local water tables and river ecosystems.`,
    sources: [
      'Natural Dyeing Traditions of Bodoland (TRI Assam Research)',
      'Ethnobotany and Fiber Technology of Northeast India'
    ]
  },
  {
    keywords: ['weaving processes', 'process', '9 stages', 'stages', 'steps', 'how is bodo cloth made'],
    basic: `The traditional Bodo textile creation workflow follows **9 systematic stages**:

1. **Ginning (Zenther)**: Separating raw cotton seed from lint.
2. **Spinning (Takhri)**: Hand-spinning slivers into fine thread.
3. **Reeling**: Unwinding continuous yarn skeins.
4. **Sizing (Jang Honay)**: Coating yarn with boiled rice paste for strength.
5. **Winding**: Spooling warp and weft bobbins.
6. **Warping**: Measuring thread length and density on pegs.
7. **Beaming**: Tensioning warp threads onto the loom beam.
8. **Drafting & Denting**: Threading warps through heddles and reed.
9. **Weaving**: Passing shuttles and hand-picking sacred Agor motifs.`,
    intermediate: `The Bodo textile workflow follows a rigorous **9-stage ethno-technological cycle**:

1. **Khun Saynay (Ginning)**: Hardwood roller separation using the *Zenther*.
2. **Khun Bangnay (Spinning)**: High-twist drafting on the *Takhri* spindle or charkha.
3. **Khou Saynay (Reeling)**: Skein formation across bamboo revolving swifts.
4. **Jang Honay (Sizing)**: Application of warm boiled rice gruel (*Maad*) with palm brushes to prevent warp abrasion.
5. **Khun Bownay (Winding)**: Transferring sizing skeins onto compact bobbins (*Boutha*).
6. **Duri Thannay (Warping)**: Setting precise warp lengths along outdoor bamboo stakes.
7. **Tanth Halnay (Beaming)**: Rolling uniform tension across the rear warp beam.
8. **Bwo Barnay (Drafting & Denting)**: Manual heddle drawing and reed threading for shed formation.
9. **Dakhna Luhnay (Weaving)**: Interlacing warp and weft with rhythmic shuttle throwing and supplementary Agor pick-insertion.`,
    sources: [
      'Traditional Weaving Processes of Bodoland (Living Archives)',
      'Material Culture of the Bodo Community'
    ]
  },
  {
    keywords: ['eri silk', 'silk', 'peace silk', 'ahimsa silk', 'endhi'],
    basic: `**Eri Silk** (locally called *Endhi*) is the indigenous peace silk of Bodoland:

• **Ahimsa Principle**: Silkworms (*Samia ricini*) feed on castor leaves and emerge safely from cocoons as moths before processing begins.
• **Thermal Comfort**: Warm in winter, cool in summer, with a soft, linen-like feel that grows softer with every wash.
• **Cultural Pride**: Used to weave prized winter shawls and ceremonial Dokhona attire.`,
    intermediate: `**Eri silk** (*Philosamia ricini* / *Samia ricini*) is an indigenous multivoltine wild silk domesticated by the Bodo community:

Biochemical and cultural characteristics:
• **Open-Ended Cocoon Morphology**: The natural loose spun cocoon allows the moth to exit without dissolving pupal walls with proteolytic enzymes, enabling non-violent (Ahimsa) harvesting.
• **Degumming**: Cocoons are boiled in filtered banana ash water (*Khar*) to eliminate natural sericin without harsh synthetic detergents.
• **Spun Silk Structure**: Because the filaments are staple fibers rather than continuous reeled threads, Eri must be carded and spindle-spun, resulting in a rich, textured yarn with exceptional thermal insulation and hypoallergenic properties.`,
    sources: [
      'Ahimsa Sericulture in Assam (Central Silk Board)',
      'Traditional Textiles and Loom Implements of Bodoland'
    ]
  }
];

export function queryHeritageKnowledge(query: string, expertise: ExpertiseLevel): KnowledgeResponse {
  const normalized = query.trim().toLowerCase();

  // Find best matching topic
  let bestMatch: TopicKnowledge | null = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized === kw) {
        score += 100;
      } else if (normalized.includes(kw)) {
        score += kw.length * 2;
      } else {
        const words = kw.split(' ');
        for (const w of words) {
          if (w.length > 3 && normalized.includes(w)) {
            score += 5;
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 8) {
    return {
      answer: expertise === 'basic' ? bestMatch.basic : bestMatch.intermediate,
      sources: bestMatch.sources
    };
  }

  // Graceful comprehensive fallback for general queries
  if (expertise === 'basic') {
    return {
      answer: `Thank you for asking about **${query.trim()}** in the context of Bodo handloom heritage.

Bodo textile culture is an indigenous heritage characterized by:
• **Handloom Weaving**: Practiced on traditional timber looms across Bodoland, utilizing Ahimsa Eri silk and organic cotton.
• **Sacred Agor Motifs**: Iconic patterns like **Hajw Agor** (hills) and **Daorai Agor** (peacock) woven without mechanical jacquards.
• **Traditional Attire**: Beautiful garments like the **Dokhona** and ceremonial **Aronai** reflecting community pride and spiritual harmony.

Try asking about specific tools (*Zenther*, *Maku*), motifs (*Agor*), or the 9-stage weaving process for deeper insights!`,
      sources: ['Bodo Handloom Cultural Heritage Repository', 'Living Village Museum Archive']
    };
  } else {
    return {
      answer: `In response to your query regarding **${query.trim()}**:

The Bodo handloom tradition embodies an intricate ethno-technological knowledge system rooted in the Bodoland Territorial Region of Assam:

• **Material Culture**: Integration of non-violent sericulture (*Samia ricini*), wild botanical mordants (banana pseudo-stem ash lye), and home-grown cotton cultivars.
• **Structural Geometry**: Precise manual shed manipulation via supplementary weft picks to execute geometric Agor compositions.
• **Loom Ergonomics**: Traditional pit looms (*Tanth*) and floor-mounted frame assemblies designed for sustained physical rhythm and tension balance.

Explore detailed inquiries about specific implements (*Zenther*, *Takhri*, *Maku*), motif semantics (*Hajw*, *Daorai*), or botanical dyeing chemistry for specialized analysis.`,
      sources: [
        'Material Culture of the Bodo Community (Dr. B. K. Daimary)',
        'Traditional Textiles and Loom Implements of Bodoland (TRI Assam)'
      ]
    };
  }
}
