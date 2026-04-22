export type CardRarity = "common" | "rare" | "epic" | "legendary";
export type ElementType =
  | "fire"
  | "grass"
  | "water"
  | "lightning"
  | "psychic"
  | "fighting"
  | "colorless";
export type AnimalType =
  | "fox"
  | "owl"
  | "bear"
  | "rabbit"
  | "raccoon"
  | "wolf"
  | "deer";
export type CardStage = "Basic" | "Stage 1" | "Stage 2";

export type CardData = {
  id: string;
  animal: AnimalType;
  name: string;
  rarity: CardRarity;
  stage: CardStage;
  hp: number;
  category: string;
  xpReward: number;
  power: number;
  ability: string;
  abilityDesc: string;
  attackName: string;
  attackDesc: string;
  attackDamage: number;
  flavor: string;
};

export const ANIMAL_META: Record<
  AnimalType,
  { label: string; role: string; color: string; element: ElementType; number: string }
> = {
  fox:     { label: "Finn",  role: "Strategist",   color: "#E8671B", element: "fire",      number: "001" },
  owl:     { label: "Ollie", role: "Investor",      color: "#7C3AED", element: "psychic",   number: "002" },
  bear:    { label: "Bruno", role: "Saver",         color: "#92400E", element: "fighting",  number: "003" },
  rabbit:  { label: "Remi",  role: "Quick Earner",  color: "#B45309", element: "lightning", number: "004" },
  raccoon: { label: "Rio",   role: "Deal Hunter",   color: "#374151", element: "colorless", number: "005" },
  wolf:    { label: "Wade",  role: "Risk Taker",    color: "#1E40AF", element: "water",     number: "006" },
  deer:    { label: "Dean",  role: "Guardian",      color: "#065F46", element: "grass",     number: "007" },
};

export const ELEMENT_CONFIG: Record<
  ElementType,
  {
    cardGradient: string;
    artGradient: string;
    headerOverlay: string;
    borderColor: string;
    glowColor: string;
    iconBg: string;
    textDark: string;
    footerBg: string;
    bokeh: string[];
  }
> = {
  fire: {
    cardGradient: "linear-gradient(170deg, #FED7AA 0%, #FB923C 45%, #C2410C 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #FEF9C3 0%, #F97316 55%, #9A3412 100%)",
    headerOverlay: "rgba(255,255,255,0.22)",
    borderColor: "#EA580C",
    glowColor: "rgba(234,88,12,0.5)",
    iconBg: "#9A3412",
    textDark: "#431407",
    footerBg: "rgba(0,0,0,0.18)",
    bokeh: ["rgba(255,255,255,0.18)", "rgba(255,200,100,0.2)", "rgba(255,120,50,0.15)"],
  },
  psychic: {
    cardGradient: "linear-gradient(170deg, #EDE9FE 0%, #A78BFA 45%, #6D28D9 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #FAF5FF 0%, #C084FC 55%, #4C1D95 100%)",
    headerOverlay: "rgba(255,255,255,0.2)",
    borderColor: "#9333EA",
    glowColor: "rgba(147,51,234,0.55)",
    iconBg: "#4C1D95",
    textDark: "#2E1065",
    footerBg: "rgba(0,0,0,0.18)",
    bokeh: ["rgba(255,255,255,0.2)", "rgba(216,180,254,0.25)", "rgba(167,139,250,0.2)"],
  },
  fighting: {
    cardGradient: "linear-gradient(170deg, #FDE68A 0%, #D97706 45%, #78350F 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #FFFBEB 0%, #B45309 55%, #451A03 100%)",
    headerOverlay: "rgba(255,255,255,0.2)",
    borderColor: "#B45309",
    glowColor: "rgba(180,83,9,0.5)",
    iconBg: "#451A03",
    textDark: "#27140A",
    footerBg: "rgba(0,0,0,0.18)",
    bokeh: ["rgba(255,255,255,0.2)", "rgba(253,230,138,0.2)", "rgba(217,119,6,0.15)"],
  },
  lightning: {
    cardGradient: "linear-gradient(170deg, #FEF9C3 0%, #FDE047 45%, #CA8A04 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #FFFFFF 0%, #FCD34D 55%, #78350F 100%)",
    headerOverlay: "rgba(255,255,255,0.28)",
    borderColor: "#CA8A04",
    glowColor: "rgba(202,138,4,0.55)",
    iconBg: "#78350F",
    textDark: "#1C0F00",
    footerBg: "rgba(0,0,0,0.15)",
    bokeh: ["rgba(255,255,255,0.3)", "rgba(253,224,71,0.3)", "rgba(250,204,21,0.2)"],
  },
  colorless: {
    cardGradient: "linear-gradient(170deg, #F9FAFB 0%, #D1D5DB 45%, #4B5563 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #FFFFFF 0%, #9CA3AF 55%, #1F2937 100%)",
    headerOverlay: "rgba(255,255,255,0.25)",
    borderColor: "#6B7280",
    glowColor: "rgba(107,114,128,0.4)",
    iconBg: "#1F2937",
    textDark: "#111827",
    footerBg: "rgba(0,0,0,0.2)",
    bokeh: ["rgba(255,255,255,0.25)", "rgba(229,231,235,0.3)", "rgba(156,163,175,0.2)"],
  },
  water: {
    cardGradient: "linear-gradient(170deg, #DBEAFE 0%, #60A5FA 45%, #1E40AF 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #EFF6FF 0%, #3B82F6 55%, #1E3A8A 100%)",
    headerOverlay: "rgba(255,255,255,0.22)",
    borderColor: "#2563EB",
    glowColor: "rgba(37,99,235,0.5)",
    iconBg: "#1E3A8A",
    textDark: "#1E1B4B",
    footerBg: "rgba(0,0,0,0.2)",
    bokeh: ["rgba(255,255,255,0.22)", "rgba(147,197,253,0.25)", "rgba(96,165,250,0.2)"],
  },
  grass: {
    cardGradient: "linear-gradient(170deg, #D1FAE5 0%, #34D399 45%, #065F46 100%)",
    artGradient:  "radial-gradient(ellipse at 45% 40%, #ECFDF5 0%, #10B981 55%, #064E3B 100%)",
    headerOverlay: "rgba(255,255,255,0.22)",
    borderColor: "#059669",
    glowColor: "rgba(5,150,105,0.5)",
    iconBg: "#064E3B",
    textDark: "#022C22",
    footerBg: "rgba(0,0,0,0.18)",
    bokeh: ["rgba(255,255,255,0.22)", "rgba(167,243,208,0.25)", "rgba(52,211,153,0.2)"],
  },
};

export const RARITY_META: Record<CardRarity, { label: string; stars: number; foil: boolean }> = {
  common:    { label: "Common",    stars: 1, foil: false },
  rare:      { label: "Rare",      stars: 2, foil: false },
  epic:      { label: "Epic",      stars: 3, foil: false },
  legendary: { label: "Legendary", stars: 4, foil: true  },
};

const HP: Record<CardRarity, number> = { common: 70, rare: 110, epic: 180, legendary: 320 };
const STAGE: Record<CardRarity, CardStage> = { common: "Basic", rare: "Stage 1", epic: "Stage 2", legendary: "Stage 2" };

export const ALL_CARDS: CardData[] = [
  // ── FOX ──
  {
    id: "fox-common-1", animal: "fox", name: "Budget Finn", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Budgeting", xpReward: 25, power: 30,
    ability: "Track It", abilityDesc: "Once per turn, look at your spending history and draw 1 card.",
    attackName: "Tight Budget", attackDesc: "Your next purchase costs 10 less.", attackDamage: 30,
    flavor: "Every dollar has a job. Even the ones hiding in your couch.",
  },
  {
    id: "fox-rare-1", animal: "fox", name: "Strategy Fox", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Planning", xpReward: 75, power: 60,
    ability: "50/30/20 Split", abilityDesc: "Divide your income perfectly. Gain +20 XP each lesson.",
    attackName: "Calculated Move", attackDesc: "Discard 1 card to deal double damage.", attackDamage: 70,
    flavor: "A clever fox plans three moves ahead — and saves on all of them.",
  },
  {
    id: "fox-epic-1", animal: "fox", name: "Market Finn", rarity: "epic",
    stage: STAGE.epic, hp: HP.epic,
    category: "Investing", xpReward: 150, power: 82,
    ability: "Compound Cunning", abilityDesc: "Your XP multiplies. Gain +50% bonus on streaks.",
    attackName: "Index Surge", attackDesc: "Attack all opponents for 40. Market conditions apply.", attackDamage: 120,
    flavor: "The market rewards patience. Finn has plenty of both.",
  },
  {
    id: "fox-legendary-1", animal: "fox", name: "Financial Freedom Finn", rarity: "legendary",
    stage: STAGE.legendary, hp: HP.legendary,
    category: "Mastery", xpReward: 500, power: 99,
    ability: "Fox Fire", abilityDesc: "Immune to debt. All costs reduced to zero this turn.",
    attackName: "Infinite Returns", attackDesc: "Discard 2 Energy. This attack cannot be reduced.", attackDamage: 330,
    flavor: "Debt gone. Goals met. Savings stacked. This is what it looks like.",
  },

  // ── OWL ──
  {
    id: "owl-common-1", animal: "owl", name: "Wise Ollie", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Saving", xpReward: 25, power: 28,
    ability: "Night Watch", abilityDesc: "Save quietly in the background. Earn 5 XP passively.",
    attackName: "Compound Stare", attackDesc: "Opponent's next move costs 2 extra.", attackDamage: 20,
    flavor: "Saves quietly while everyone else sleeps on their money.",
  },
  {
    id: "owl-rare-1", animal: "owl", name: "Index Ollie", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Investing", xpReward: 80, power: 65,
    ability: "Broad Vision", abilityDesc: "Sees the whole market. Draw 2 cards on your turn.",
    attackName: "Diversify", attackDesc: "Split 60 damage between two targets.", attackDamage: 60,
    flavor: "Sees the whole market. Buys all of it.",
  },
  {
    id: "owl-legendary-1", animal: "owl", name: "Warren Ollie", rarity: "legendary",
    stage: STAGE.legendary, hp: HP.legendary,
    category: "Mastery", xpReward: 500, power: 97,
    ability: "Value Vision", abilityDesc: "Cannot be KO'd by market crashes. Hold forever.",
    attackName: "Permanent Hold", attackDesc: "This Pokémon cannot retreat. Deal 300 damage.", attackDamage: 300,
    flavor: "Buy great things at fair prices. Hold forever.",
  },

  // ── BEAR ──
  {
    id: "bear-common-1", animal: "bear", name: "Saver Bruno", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Saving", xpReward: 25, power: 35,
    ability: "Hibernate Fund", abilityDesc: "Store 1 resource. Retrieve it next turn with interest.",
    attackName: "Slow and Steady", attackDesc: "Deal 10, then heal 10 HP.", attackDamage: 20,
    flavor: "Stores up for winter. And the winter after that.",
  },
  {
    id: "bear-rare-1", animal: "bear", name: "Emergency Bruno", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Safety Net", xpReward: 70, power: 58,
    ability: "6-Month Cave", abilityDesc: "Once per game, survive a KO hit with 10 HP remaining.",
    attackName: "Iron Reserve", attackDesc: "Heal 30 HP before dealing damage.", attackDamage: 50,
    flavor: "Six months of expenses, locked away, untouchable.",
  },
  {
    id: "bear-legendary-1", animal: "bear", name: "Iron Bruno", rarity: "legendary",
    stage: STAGE.legendary, hp: HP.legendary,
    category: "Mastery", xpReward: 500, power: 95,
    ability: "Unstoppable", abilityDesc: "Take 50 less damage from all sources. Cannot be poisoned.",
    attackName: "Immovable", attackDesc: "Discard 2 Energy. Deal 280 and heal 80 HP.", attackDamage: 280,
    flavor: "Immovable savings. Unshakeable discipline. Pure bear energy.",
  },

  // ── RABBIT ──
  {
    id: "rabbit-common-1", animal: "rabbit", name: "Side Hustle Remi", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Earning", xpReward: 25, power: 27,
    ability: "Quick Cash", abilityDesc: "Gain 1 extra Energy at the start of each turn.",
    attackName: "Fast Buck", attackDesc: "Flip a coin. Heads: deal 40. Tails: draw 2 cards.", attackDamage: 20,
    flavor: "Three side hustles before breakfast.",
  },
  {
    id: "rabbit-rare-1", animal: "rabbit", name: "Streak Remi", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Habits", xpReward: 75, power: 62,
    ability: "Daily Rep", abilityDesc: "Each consecutive turn you play, this card gets +10 damage.",
    attackName: "Compound Hop", attackDesc: "20+ damage for each day of your streak (max 100).", attackDamage: 60,
    flavor: "Small moves. Every single day. It adds up faster than you think.",
  },
  {
    id: "rabbit-epic-1", animal: "rabbit", name: "No-Spend Remi", rarity: "epic",
    stage: STAGE.epic, hp: HP.epic,
    category: "Frugality", xpReward: 155, power: 78,
    ability: "Month Freeze", abilityDesc: "Opponent cannot play Item cards for 2 turns.",
    attackName: "Savings Sprint", attackDesc: "If you haven't spent this turn, deal 180.", attackDamage: 150,
    flavor: "Thirty days, zero impulse buys. The savings speak for themselves.",
  },

  // ── RACCOON ──
  {
    id: "raccoon-common-1", animal: "raccoon", name: "Coupon Rio", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Frugality", xpReward: 20, power: 25,
    ability: "Dumpster Dive", abilityDesc: "Once per game, recover 1 discarded card from either discard pile.",
    attackName: "Half Off", attackDesc: "Reduce opponent's next attack damage by half.", attackDamage: 20,
    flavor: "Found it for free. Twice.",
  },
  {
    id: "raccoon-rare-1", animal: "raccoon", name: "Deal Hunter Rio", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Shopping", xpReward: 65, power: 55,
    ability: "Price Alert", abilityDesc: "Look at the top 3 cards of your deck and rearrange them.",
    attackName: "Price Match", attackDesc: "Deal damage equal to the opponent's last attack.", attackDamage: 60,
    flavor: "Never pays full price. Never.",
  },
  {
    id: "raccoon-epic-1", animal: "raccoon", name: "Cashback Rio", rarity: "epic",
    stage: STAGE.epic, hp: HP.epic,
    category: "Credit", xpReward: 140, power: 76,
    ability: "Rewards Stack", abilityDesc: "Gain 1 Energy for every 3 cards in your discard pile.",
    attackName: "Arbitrage", attackDesc: "Deal 120. Gain Energy equal to damage dealt ÷ 30.", attackDamage: 120,
    flavor: "Gets paid to spend. The right way.",
  },

  // ── WOLF ──
  {
    id: "wolf-common-1", animal: "wolf", name: "Risk Wade", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Investing", xpReward: 25, power: 32,
    ability: "Calculated Risk", abilityDesc: "May discard 1 card to flip a coin. Heads: +30 damage.",
    attackName: "Market Bite", attackDesc: "20 damage. Opponent discards 1 card.", attackDamage: 30,
    flavor: "Never bets what he can't afford to lose.",
  },
  {
    id: "wolf-rare-1", animal: "wolf", name: "Stock Wade", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Investing", xpReward: 80, power: 68,
    ability: "Pack Mentality", abilityDesc: "For each Water Pokémon on your bench, this gains +20 HP.",
    attackName: "Bull Run", attackDesc: "Deal 80 damage. If your deck has 20+ cards, deal 100 instead.", attackDamage: 80,
    flavor: "Diversified portfolio. Moves with the market.",
  },
  {
    id: "wolf-legendary-1", animal: "wolf", name: "Alpha Wade", rarity: "legendary",
    stage: STAGE.legendary, hp: HP.legendary,
    category: "Mastery", xpReward: 500, power: 96,
    ability: "Apex Investor", abilityDesc: "Once per game: double all damage this turn.",
    attackName: "All In", attackDesc: "Discard your hand. Deal 320 damage.", attackDamage: 320,
    flavor: "Max risk, max reward. But he did the homework first.",
  },

  // ── DEER ──
  {
    id: "deer-common-1", animal: "deer", name: "Safe Dean", rarity: "common",
    stage: STAGE.common, hp: HP.common,
    category: "Safety Net", xpReward: 20, power: 26,
    ability: "Steady Steps", abilityDesc: "Reduce damage taken by 10 on your first turn.",
    attackName: "Careful Footing", attackDesc: "Heal 20 HP. Deal 10 damage.", attackDamage: 10,
    flavor: "Low risk, low stress. Always protected.",
  },
  {
    id: "deer-rare-1", animal: "deer", name: "Insurance Dean", rarity: "rare",
    stage: STAGE.rare, hp: HP.rare,
    category: "Protection", xpReward: 70, power: 57,
    ability: "Full Coverage", abilityDesc: "Prevent all damage from attacks to your benched Pokémon.",
    attackName: "Covered", attackDesc: "Heal 40 HP, then deal 40 damage.", attackDamage: 40,
    flavor: "Covered for everything. Worried about nothing.",
  },
  {
    id: "deer-epic-1", animal: "deer", name: "Estate Dean", rarity: "epic",
    stage: STAGE.epic, hp: HP.epic,
    category: "Planning", xpReward: 150, power: 81,
    ability: "Legacy Lock", abilityDesc: "Cards you play cannot be discarded by opponent effects.",
    attackName: "Generational Wealth", attackDesc: "Deal 140. Next turn, your attacks deal +40.", attackDamage: 140,
    flavor: "Building wealth for the next generation, not just this one.",
  },
];
