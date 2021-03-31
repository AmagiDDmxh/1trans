import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Requester from "./request";
import { LANGUAGES } from "./constants";
import { keys, log } from "./utils";

dotenv.config();

const { DEEPL_API_TOKEN } = process.env;

if (!DEEPL_API_TOKEN) {
  throw Error("No token was specified");
}

const requester = new Requester(DEEPL_API_TOKEN);

export const transform = async ({
  translations,
  translationsToCompare,
  from,
  to,
}) => {
  const translationKeys = keys(translations);

  const stringMap = translationKeys.map((key, index) => ({
    index,
    value: translationsToCompare[key] ?? translations[key],
  }));

  const diffResult = [];
  for (let index = 0; index < translationKeys.length; index++) {
    const key = translationKeys[index];
    const value = translations[key];
    if (!translationsToCompare.hasOwnProperty(key)) {
      diffResult.push({ index, value });
    }
  }

  const stringsToTranslate = diffResult
    .map(({ index, value }) => `[${index}] ${value}`)
    .join("||");

  log("string to translate", stringsToTranslate);

  const response = await requester.translate({
    text: stringsToTranslate,
    from,
    to,
  });

  log("Translated result:", response);

  if (!response) {
    return;
  }

  const translatedString = response.translations[0].text;

  translatedString.split("||").forEach((text) => {
    log("formatting", text);
    const matches = text.match(/\[(\d+)\]\s?/);
    if (!matches) {
      log("no match on", text);
      return;
    }
    const [seperator, indexString] = matches!;
    const index = Number(indexString.replace(/\[(\d+)\]\s?/, ""));
    const value = text.slice(seperator.length);
    log("formatted", index, value);
    stringMap[index].value = value;
  });

  const translatedTranslations = {};
  translationKeys.forEach((key, index) => {
    translatedTranslations[key] = stringMap[index].value;
  });

  return translatedTranslations;
};

(async () => {
  const [source, target] = process.argv.slice(2);

  if (!source || !target) {
    // validation
    return;
  }

  try {
    const translations = JSON.parse(fs.readFileSync(source).toString());
    const translationsToCompare = JSON.parse(
      fs.readFileSync(target).toString()
    );

    const result = await transform({
      translations,
      translationsToCompare,
      from: LANGUAGES.chinese,
      to: LANGUAGES.englishAmerican,
    });

    const outPath = path.join(
      __dirname,
      "..",
      "output",
      `translation_${Date.now()}.json`
    );
    log("file outputed at", outPath);
    fs.writeFileSync(outPath, JSON.stringify(result));
    // log("finish translate", result);
  } catch (e) {
    log("Error on translating json", e);
  }
})();
