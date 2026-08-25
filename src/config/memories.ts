/**
 * Sample daily memories — replace with your own before gifting.
 * One unlocks each day from MEMORY_START until the target date.
 */
export const DAILY_MEMORIES: { title: string; body: string; emoji: string }[] = [
  { emoji: '🌙', title: 'First orbit', body: 'The night you were born, the moon was waxing — a crescent holding its breath for you.' },
  { emoji: '✨', title: 'Najafgarh sky', body: 'From Najafgarh, Haryana, the Milky Way sometimes peeks through the monsoon haze. That was your first ceiling.' },
  { emoji: '🎂', title: 'September child', body: 'Born on the 12th — when summer softens into festival season and the air smells like rain on warm earth.' },
  { emoji: '🛰️', title: '1991', body: 'The year the web was born, and so were you — two quiet revolutions starting on different orbits.' },
  { emoji: '💫', title: 'Little rituals', body: 'Remember that late-night chai on the terrace? The stars were always louder than the traffic.' },
  { emoji: '🌸', title: 'Soft strength', body: 'You carry warmth like gravity — invisible, but everything orbits around it.' },
  { emoji: '🎵', title: 'Soundtrack', body: 'There is a song that always felt like home. Play it tonight — Luna is listening too.' },
  { emoji: '📸', title: 'Frozen frame', body: 'One photograph where you are laughing so hard the world blurs — that is the real you.' },
  { emoji: '🚲', title: 'Wide lanes', body: 'Najafgarh evenings: cycles, cousins, and a sky that turned indigo before anyone noticed.' },
  { emoji: '☕', title: 'Morning you', body: 'Groggy, squinting at sunlight, still kind — that version of you is my favorite discovery.' },
  { emoji: '🌧️', title: 'Monsoon gift', body: 'Rain on tin roofs. Petrichor. The kind of weather that makes hearts honest.' },
  { emoji: '🎁', title: 'Almost there', body: 'Every daily memory is a piece of a constellation. Soon the full picture appears.' },
  { emoji: '🔭', title: 'Look up', body: 'On your birth night, Jupiter and Saturn were wandering the ecliptic — giants keeping watch.' },
  { emoji: '💌', title: 'Unsent letters', body: 'All the things left unsaid gather as starlight. They reach you anyway.' },
  { emoji: '🌅', title: 'Golden hour', body: 'You photograph sunsets like you are saving them for someone. You were.' },
  { emoji: '🧩', title: 'Puzzle piece', body: 'Each solved tile is a day closer. The picture is love, obviously.' },
  { emoji: '🕯️', title: 'Diwali memory', body: 'Diyas on the doorstep, crackers in the distance, your smile brighter than both.' },
  { emoji: '🌌', title: 'Final approach', body: 'Twelve September approaches. The sky has been rehearsing this reveal for thirty-five years.' },
]

export function getUnlockedMemoryCount(now = new Date(), startIso: string, total: number): number {
  const start = new Date(startIso)
  start.setHours(0, 0, 0, 0)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const elapsed = Math.floor((today.getTime() - start.getTime()) / 86400000)
  return Math.min(total, Math.max(0, elapsed + 1))
}

export function getTodaysMemory(now = new Date(), startIso: string): (typeof DAILY_MEMORIES)[number] | null {
  const unlocked = getUnlockedMemoryCount(now, startIso, DAILY_MEMORIES.length)
  if (unlocked <= 0) return null
  return DAILY_MEMORIES[unlocked - 1] ?? null
}
