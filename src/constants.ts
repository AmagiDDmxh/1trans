export const DEEPL_API_URL = "https://api-free.deepl.com/v2";

// TODO: Add target languages specified here: https://www.deepl.com/docs-api/translating-text/#Request%20Parameters
export const LANGUAGES = {
  bulgarian: "bg",
  czech: "cs",
  danish: "da",
  german: "de",
  greek: "el",
  english: "en",
  spanish: "es",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  hungarian: "hu",
  italian: "it",
  japanese: "ja",
  lithuanian: "lt",
  latvian: "lv",
  dutch: "nl",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  slovak: "sk",
  slovenian: "sl",
  swedish: "sv",
  chinese: "zh"
} as const

type ValuesOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];
export type LangVal = ValuesOf<typeof LANGUAGES>
export type LangKey = keyof typeof LANGUAGES
