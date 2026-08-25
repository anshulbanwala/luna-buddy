const MAX_SIZE = 900

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** CSS background-position/size for a 3×3 tile (value 1–8) */
export function getImageTileStyle(
  imageUrl: string,
  value: number,
  grid = 3,
): { backgroundImage: string; backgroundSize: string; backgroundPosition: string } {
  const col = (value - 1) % grid
  const row = Math.floor((value - 1) / grid)
  const pct = 100 / (grid - 1)
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${col * pct}% ${row * pct}%`,
  }
}

export async function normalizeImageDataUrl(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl)
  const size = Math.min(MAX_SIZE, Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const sx = (img.width - Math.min(img.width, img.height)) / 2
  const sy = (img.height - Math.min(img.width, img.height)) / 2
  const s = Math.min(img.width, img.height)
  ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.92)
}
