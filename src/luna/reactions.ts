export type LunaReaction = 'idle' | 'tap' | 'hearts' | 'hug' | 'spin' | 'kiss'

const tapWhispers = [
  'Hehe — that tickled.',
  'You found me!',
  'Again? I love it.',
  'Boing!',
  'You make me giggle.',
]

const heartWhispers = [
  'Sending you star-hugs.',
  'My heart did a little flip.',
  'For you. Always.',
  'Caught in a heart storm.',
  'You are so loved.',
]

const hugWhispers = [
  'Stay here a moment.',
  'Cozy hug activated.',
  'Warm like moonlight.',
  'I am not letting go yet.',
]

const kissWhispers = [
  'A tiny kiss for you.',
  'Mwah.',
  'Blushing already.',
]

const spinWhispers = [
  'Wheee!',
  'The stars are spinning too.',
]

export function getReactionWhisper(reaction: LunaReaction, loveMode: boolean): string {
  const pool = (() => {
    switch (reaction) {
      case 'hearts': return heartWhispers
      case 'hug': return hugWhispers
      case 'kiss': return kissWhispers
      case 'spin': return spinWhispers
      default: return tapWhispers
    }
  })()

  const msg = pool[Math.floor(Math.random() * pool.length)]
  if (loveMode && reaction !== 'hearts') {
    return `${msg} ♥`
  }
  return msg
}
