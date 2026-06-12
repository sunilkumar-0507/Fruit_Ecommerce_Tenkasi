// Multi-word keywords must come before single-word ones so "Custard Apple" beats "Apple"
export const FRUIT_KEYWORDS = [
  'Custard Apple', 'Passion Fruit', 'Dragon Fruit', 'Star Fruit',
  'Pineapple', 'Watermelon', 'Pomegranate', 'Jackfruit',
  'Gooseberry', 'Mangosteen', 'Rambutan', 'Tamarind',
  'Mango', 'Banana', 'Papaya', 'Guava', 'Orange', 'Coconut',
  'Lemon', 'Litchi', 'Grapes', 'Sapota', 'Avocado', 'Melon',
  'Apple', 'Pear', 'Plum', 'Peach', 'Fig', 'Lime', 'Amla',
  'Jamun', 'Dates',
]

// Sort longest-first so multi-word entries are checked before shorter ones
const SORTED = [...FRUIT_KEYWORDS].sort((a, b) => b.length - a.length)

export function extractFruitType(name: string): string | null {
  const lower = name.toLowerCase()
  for (const kw of SORTED) {
    if (lower.includes(kw.toLowerCase())) return kw
  }
  return null
}
