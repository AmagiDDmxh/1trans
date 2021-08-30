import fs from "fs-extra";
import { join } from 'path'
import dotenv from "dotenv";
import { program } from 'commander'

import { log, } from "./utils";
import Requester, { Translation } from "./request";
import { LangVal, LANGUAGES, LangKey } from "./constants";

dotenv.config();

const { DEEPL_API_TOKEN } = process.env;

if (!DEEPL_API_TOKEN) {
  throw new Error("No token was specified, place your DEEPL_API_TOKEN token in .env file.");
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
  from?: LangVal;
  to: LangVal;
  output?: boolean;
}

/**
 * 把 value 粘合在一起
 * ['a', 'b', 'c'] => 'a\n.\nb\n.\nc'
 */
export const glueStrings = (strings: Array<string>) => {
  const stringsToTranslate: string[] = [];

  strings.forEach((str) => {
    const escapedStr = str.replace('{', '\\{').replace('}', '\\}')
    stringsToTranslate.push(escapedStr);
  });

  return stringsToTranslate.join("\n.\n");
}

const transform = async ({
  translations,
  from,
  to,
  output,
}: TransformParams) => {
  const keys = Object.keys(translations);
  const values = Object.values(translations);

  const strings: string[] = values.map((val) => {
    if (val.string) {
      return val.string;
    }
    return val;
  });

  const stringifyedTranslations = glueStrings(strings)

  log("Start requesting API");

  const response = await requester.translate({
    text: stringifyedTranslations,
    from,
    to,
  });

  log("Response with", response);

  if (!response) {
    return log("Non response provided, check if is network problem");
  }

  const translatedStrings: Translation[] = response.translations;
  log(translatedStrings)

  fs.writeFileSync(join(__dirname, `../temp-${Date.now()}.response`), JSON.stringify(translatedStrings))

  // translatedStrings.forEach(({ text }) => {
  //   const matches = text.match(/\s?ð(\d+)ð\s?\.?/);
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

const isSuppoortedFileFormat = (translation?: any | null) => typeof Object.values(translation ?? {})?.[0] === "string";

type Options = { target: LangVal | LangKey; source?: LangKey; format?: string }
const main = async (inputFile: string, outputFile: string, options: Options) => {
  const { target, source } = options

  if (!LANGUAGES[target as LangKey] || !Object.values(LANGUAGES).includes(target as LangVal)) {
    throw new Error("Unsupported target language. Visit https://www.deepl.com/docs-api/translating-text/#Request%20Parameters to see what languages are supported.")
  }

  if (!fs.existsSync(inputFile)) {
    throw new Error("Add your input file as 3rd argument: CLI-NAME <input-file>")
  }

  log("Reading input", inputFile);
  const jsonString = fs.readFileSync(inputFile).toString();
  try {
    log("Start formatting");
    const jsonFile = JSON.parse(jsonString);
    // format
    if (!isSuppoortedFileFormat(jsonFile)) {
      throw new Error("Onlu key-value paired JSON format is supported!")
    }

    log("Translating...");

    const result = await transform({
      translations: jsonFile,
      from: source ? LANGUAGES[source] : undefined,
      to: LANGUAGES[target as LangKey] || target,
      output: true,
    });
    log(result);
  } catch (e) {
    log("Unable to parse json file with error", e);
  }
};


const version = require('../package.json').version

program
  .version(version, '-v, --version')
  .argument('<inputFile>', 'File to translate')
  .argument('[outputFile]', 'Specify where to output, defaults = <inputFile>-<locale>.json')
  .option('-f, --format <format>', 'File format of input translation file, only key-value JSON is supported...')
  .option('-s, --source <lang>', 'Source language, defaults = auto. Visit https://www.deepl.com/docs-api/translating-text/#Request%20Parameters for supported languages.')
  .requiredOption('-t, --target <lang>', 'Target language, required. Visit https://www.deepl.com/docs-api/translating-text/#Request%20Parameters for supported languages.')
  .action(main)

if (process.argv.length < 3) {
  program.help()
} else {
  program.parse(process.argv)
}
