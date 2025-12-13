/**
 * VIBE TAXONOMY
 * Maps high-level vibes to notes and accords
 */

export type VibeType =
  | "fresh"
  | "clean"
  | "sweet"
  | "dark"
  | "woody"
  | "spicy"
  | "powdery"
  | "smoky"
  | "floral"
  | "citrus"
  | "aquatic"
  | "green"
  | "warm"
  | "cool"
  | "gourmand"
  | "oriental"
  | "masculine"
  | "feminine"
  | "unisex"

export interface VibeMapping {
  notes: string[]
  accords: string[]
  weight: number // How strongly this note/accord contributes to the vibe (0-1)
}

export const VIBE_TAXONOMY: Record<VibeType, VibeMapping> = {
  fresh: {
    notes: [
      "bergamot", "lemon", "lime", "grapefruit", "orange", "mandarin", "neroli",
      "mint", "peppermint", "spearmint", "eucalyptus", "green tea", "cucumber",
      "watermelon", "apple", "pear", "aloe", "bamboo"
    ],
    accords: ["fresh", "citrus", "green", "aquatic"],
    weight: 1.0,
  },
  clean: {
    notes: [
      "soap", "cotton", "linen", "white musk", "aldehydes", "lily of the valley",
      "jasmine", "rose", "lavender", "iris", "violet", "peony", "magnolia",
      "ozone", "water", "rain"
    ],
    accords: ["fresh", "floral", "white floral", "aldehydic"],
    weight: 1.0,
  },
  sweet: {
    notes: [
      "vanilla", "caramel", "honey", "sugar", "maple", "chocolate", "cocoa",
      "praline", "almond", "hazelnut", "toffee", "cotton candy", "marshmallow",
      "fruity", "peach", "apricot", "strawberry", "raspberry", "cherry", "plum"
    ],
    accords: ["sweet", "gourmand", "fruity", "vanilla"],
    weight: 1.0,
  },
  dark: {
    notes: [
      "patchouli", "oud", "amber", "labdanum", "benzoin", "incense", "myrrh",
      "frankincense", "vetiver", "leather", "tobacco", "coffee", "dark chocolate",
      "black pepper", "cinnamon", "clove", "nutmeg", "cardamom"
    ],
    accords: ["dark", "oriental", "woody", "spicy", "amber"],
    weight: 1.0,
  },
  woody: {
    notes: [
      "cedar", "sandalwood", "pine", "fir", "oak", "birch", "teak", "mahogany",
      "vetiver", "guaiac wood", "palo santo", "agarwood", "oud", "ebony"
    ],
    accords: ["woody", "forest", "dry woods"],
    weight: 1.0,
  },
  spicy: {
    notes: [
      "pepper", "black pepper", "pink pepper", "cardamom", "cinnamon", "clove",
      "nutmeg", "ginger", "cumin", "coriander", "saffron", "turmeric", "anise",
      "star anise", "fennel"
    ],
    accords: ["spicy", "oriental", "warm spicy"],
    weight: 1.0,
  },
  powdery: {
    notes: [
      "iris", "orris", "violet", "heliotrope", "mimosa", "almond", "tonka bean",
      "vanilla", "musk", "amber", "sandalwood"
    ],
    accords: ["powdery", "soft", "floral"],
    weight: 1.0,
  },
  smoky: {
    notes: [
      "smoke", "incense", "frankincense", "myrrh", "oud", "leather", "tobacco",
      "birch tar", "guaiac wood", "cade", "labdanum"
    ],
    accords: ["smoky", "dark", "woody"],
    weight: 1.0,
  },
  floral: {
    notes: [
      "rose", "jasmine", "lily", "lily of the valley", "peony", "magnolia",
      "gardenia", "tuberose", "ylang-ylang", "neroli", "orange blossom",
      "lavender", "violet", "iris", "orchid", "freesia", "hyacinth"
    ],
    accords: ["floral", "white floral", "rose", "jasmine"],
    weight: 1.0,
  },
  citrus: {
    notes: [
      "lemon", "lime", "grapefruit", "orange", "mandarin", "bergamot", "yuzu",
      "kumquat", "tangerine", "clementine", "bitter orange"
    ],
    accords: ["citrus", "fresh"],
    weight: 1.0,
  },
  aquatic: {
    notes: [
      "water", "ozone", "calone", "seaweed", "salt", "marine", "aquatic",
      "rain", "dew", "water lily", "lotus"
    ],
    accords: ["aquatic", "fresh", "marine"],
    weight: 1.0,
  },
  green: {
    notes: [
      "grass", "green tea", "matcha", "galbanum", "violet leaf", "tomato leaf",
      "basil", "mint", "eucalyptus", "pine", "fir", "bamboo", "cucumber"
    ],
    accords: ["green", "fresh", "herbal"],
    weight: 1.0,
  },
  warm: {
    notes: [
      "vanilla", "amber", "tonka bean", "benzoin", "cinnamon", "nutmeg",
      "cardamom", "sandalwood", "cedar", "honey", "caramel", "cocoa"
    ],
    accords: ["warm", "amber", "gourmand", "oriental"],
    weight: 1.0,
  },
  cool: {
    notes: [
      "mint", "eucalyptus", "menthol", "camphor", "ice", "water", "ozone",
      "cucumber", "green tea", "aloe"
    ],
    accords: ["fresh", "cool", "aquatic"],
    weight: 1.0,
  },
  gourmand: {
    notes: [
      "vanilla", "caramel", "chocolate", "coffee", "honey", "maple", "praline",
      "almond", "hazelnut", "toffee", "cotton candy", "marshmallow", "cocoa"
    ],
    accords: ["gourmand", "sweet", "vanilla"],
    weight: 1.0,
  },
  oriental: {
    notes: [
      "amber", "incense", "oud", "patchouli", "vanilla", "tonka bean",
      "benzoin", "labdanum", "spices", "cinnamon", "clove", "cardamom"
    ],
    accords: ["oriental", "amber", "spicy"],
    weight: 1.0,
  },
  masculine: {
    notes: [
      "vetiver", "cedar", "leather", "tobacco", "oud", "amber", "patchouli",
      "bergamot", "lavender", "sage", "juniper", "whiskey", "rum"
    ],
    accords: ["woody", "spicy", "fresh"],
    weight: 0.8, // Lower weight as it's more contextual
  },
  feminine: {
    notes: [
      "rose", "jasmine", "lily", "peony", "violet", "iris", "vanilla",
      "peach", "apricot", "strawberry", "cherry", "powdery"
    ],
    accords: ["floral", "sweet", "powdery"],
    weight: 0.8,
  },
  unisex: {
    notes: [
      "bergamot", "lavender", "jasmine", "rose", "cedar", "sandalwood",
      "amber", "musk", "vanilla", "vetiver"
    ],
    accords: ["fresh", "woody", "floral"],
    weight: 0.6,
  },
}

/**
 * Context words that map to vibe combinations
 */
export const CONTEXT_MAPPINGS: Record<string, VibeType[]> = {
  // Time/Season
  summer: ["fresh", "citrus", "aquatic", "cool"],
  winter: ["warm", "dark", "woody", "spicy"],
  spring: ["floral", "fresh", "green", "light"],
  fall: ["woody", "spicy", "warm", "oriental"],
  autumn: ["woody", "spicy", "warm", "oriental"],
  
  // Occasions
  office: ["clean", "fresh", "unisex"],
  professional: ["clean", "fresh", "unisex"],
  date: ["sweet", "warm", "floral", "gourmand"],
  "date night": ["sweet", "warm", "dark", "oriental"],
  everyday: ["fresh", "clean", "unisex"],
  casual: ["fresh", "clean", "citrus"],
  formal: ["woody", "spicy", "oriental", "dark"],
  evening: ["dark", "warm", "oriental", "woody"],
  night: ["dark", "warm", "oriental", "woody"],
  
  // Intensity
  light: ["fresh", "clean", "citrus", "aquatic"],
  subtle: ["clean", "fresh", "powdery"],
  strong: ["dark", "woody", "spicy", "oriental"],
  intense: ["dark", "woody", "spicy", "smoky"],
  
  // Additional descriptors
  masculine: ["masculine", "woody", "spicy", "fresh"],
  feminine: ["feminine", "floral", "sweet", "powdery"],
}
