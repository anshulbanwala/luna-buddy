/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUBJECT_NAME?: string
  readonly VITE_BIRTH_DATE?: string
  readonly VITE_BIRTH_TIME?: string
  readonly VITE_BIRTH_LAT?: string
  readonly VITE_BIRTH_LON?: string
  readonly VITE_BIRTH_PLACE?: string
  readonly VITE_FINAL_MESSAGE?: string
  readonly VITE_TARGET_YEAR?: string
  readonly VITE_TARGET_MONTH?: string
  readonly VITE_TARGET_DAY?: string
  readonly VITE_STAR_DATES?: string
  readonly VITE_MEMORY_START?: string
  readonly VITE_PUZZLE_IMAGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
