import fs from "fs";
import dotenv from "dotenv";

import { isCn, log, mapObject } from "./utils";
import Requester from "./request";
import { LANGUAGES } from "./constants";

dotenv.config();

const { DEEPL_API_TOKEN } = process.env;

if (!DEEPL_API_TOKEN) {
  throw Error("No token was specified");
}

const requester = new Requester(DEEPL_API_TOKEN);

interface TranslationString {
  string: string;
}

type TranslationInput =
  | Record<string, TranslationString>
  | Record<string, string>;
interface TransformParams {
  translationsToCompare?: TranslationInput;
  translations: TranslationInput;
  from: string;
  to: string;
  output?: boolean;
}

const transform = async ({
  translations,
  translationsToCompare,
  from,
  to,
  output,
}: TransformParams) => {
  const keys = Object.keys(translations);
  const values = Object.values(translations);
  // Formatting
  const strings: string[] = values.map((val) => {
    if (val.string) {
      return val.string;
    }
    return val;
  });

  // Comparing
  let stringsToTranslate: { value: string; index: number }[] = [];

  // Single file, determined
  if (!translationsToCompare) {
    strings.forEach((str, index) => {
      // TODO: Add more language support
      // Here do the source language detection
      if (isCn(str)) {
        // translate it
        // const normalized
        const translatedStr = { value: str, index };
        stringsToTranslate.push(translatedStr);
        return translatedStr;
      }
      return { value: str, index };
    });
  } else {
    compare(translations, translationsToCompare, )
  }

  const stringifyedTranslations = stringsToTranslate
    .map(({ value, index }) => `[${index}] ${value}`)
    .join("||");

  // log(stringifyedTranslations);

  stringifyedTranslations.split("||").map((str) => {
    const REGEX_INDEX_SEP = /\[(\d+)\]\s/;
    const matches = str.match(REGEX_INDEX_SEP);
    if (!matches) {
      return str;
    }
    const [placeholder, indexStr] = matches;
    return str.slice(placeholder.length);
  });

  log("Start requesting API");

  const response = await requester.translate({
    text: stringifyedTranslations,
    from,
    to,
  });

  log("Response with", response);

  // const translatedStrings: TranslationResponse[] = response.translations;

  // translatedStrings.forEach(({ text }) => {
  //   const matches = text.match(/,?\s?i[0-9]+$/);
  //   if (!matches) {
  //     log("no match on", text);
  //     return;
  //   }
  //   const [indexString] = matches!;
  //   const { index: stringSpeIndex } = matches!;
  //   const index = Number(indexString.replace(/,?\s?i/g, ""));
  //   const value = text.slice(0, stringSpeIndex);
  //   stringMap[index].value = value;
  // });

  // const translatedTranslations: Record<string, TranslationString> = {};

  // keys.forEach((key, index) => {
  //   translatedTranslations[key] = {
  //     string: stringMap[index].value,
  //   };
  // });

  // if (!fs.existsSync("./output")) {
  //   fs.mkdirSync("./output");
  // }

  // if (output) {
  //   fs.writeFileSync(
  //     `./output/translated_translation_${Date.now()}.json`,
  //     JSON.stringify(translatedTranslations, null, 2)
  //   );
  // }

  // return translatedTranslations;
};

(async () => {
  const input = process.argv[2];

  if (input && fs.existsSync(input)) {
    log("Reading input", input);
    const jsonString = fs.readFileSync(input).toString();
    try {
      log("Start formatting");
      const jsonFile = JSON.parse(jsonString);
      let normalizedTranslations = jsonFile;
      // format
      if (typeof Object.values(normalizedTranslations)[0] === "string") {
        normalizedTranslations = mapObject(jsonFile, (v: string) => ({
          string: v,
        })) as Record<string, TranslationString>;
      }
      log("Translating...");
      const result = await transform({
        translations: normalizedTranslations,
        from: LANGUAGES.chinese,
        to: LANGUAGES.englishAmerican,
        output: true,
      });
      // log("Done!");
      log(result);
    } catch (e) {
      log("Unable to parse json file!", e);
    }
  }
})();
