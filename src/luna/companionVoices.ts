export type MochiMood = 'idle' | 'happy' | 'sleepy' | 'excited' | 'shy' | 'munch'

export const MOOCHI_REACTIONS: { mood: MochiMood; line: string; emoji: string }[] = [
  { mood: 'happy', line: 'Boop registered. Filing under favorites.', emoji: '💗' },
  { mood: 'excited', line: 'Again again again!', emoji: '✨' },
  { mood: 'shy', line: '…you saw me sleeping.', emoji: '🫣' },
  { mood: 'munch', line: 'Munching stardust. Want some?', emoji: '🍡' },
  { mood: 'sleepy', line: 'Five more minutes of universe.', emoji: '💤' },
  { mood: 'idle', line: 'I live here now. Rent is cuddles.', emoji: '🐷' },
]

export const DRIFT_WHISPERS = [
  'z z z…',
  'oink pass-through',
  'late-night chai energy',
  'shh the sky is listening',
  'found a comfy cloud',
  '…👀',
  'boop?',
  'dreaming in pink',
]

export const SKY_INTROS = [
  'This is the exact ceiling from your first night.',
  'Ten thirty-five PM. Najafgarh. The universe leaned in.',
  'Every star here was present when you arrived.',
]

export const TERRACE_GREETINGS = [
  'Welcome back to the terrace.',
  'The night saved you a seat.',
  'Something soft is waiting.',
]
