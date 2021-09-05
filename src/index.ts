import fs from "fs-extra";
import { join } from 'path'
import dotenv from "dotenv";
import { program } from 'commander'
import { red, cyan } from 'colors'

import { createOutputPath, log, } from "./utils";
import Requester, { Translation } from "./request";
import { LangVal, LANGUAGES, LangKey } from "./constants";

dotenv.config();

const { DEEPL_API_TOKEN } = process.env;

if (!DEEPL_API_TOKEN) {
  log(red("No deepl token was specified, declare your token in env DEEPL_API_TOKEN in order to use one-trans. e.g. "));
  log(cyan("\"DEEPL_API_TOKEN=xxx && one-trans\""));
  process.exit(1)
}

const requester = new Requester(DEEPL_API_TOKEN);
const OUTPUT_PATH = join(__dirname, '../output')

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
  output: string;
}

/**
 * 把 value 粘合在一起
 * ['a', 'b', 'c'] => 'a\n.\nb\n.\nc'
 */
export const glueStrings = (strings: Array<string>) => {
  const stringsToTranslate: string[] = strings.map((str) => {
    if (/\{(.*).+\}/.test(str)) return '';
    if (/\<([^\s])+\>/.test(str)) return '';

    return str;
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

  if (!response) {
    return log("Non response provided, check if is network problem");
  }

  const translatedStrings: Translation[] = response.translations;
  // Only one text return for now
  const tranlsatedString = translatedStrings[0].text

  // Write to store it
  fs.writeFileSync(join(__dirname, `../temp-${Date.now()}.response.json`), JSON.stringify(translatedStrings))

  const finalJSON: Record<string, string> = {}
  tranlsatedString.split('\n.\n').forEach((text, index) => {
    const key = keys[index]
    if (text) {
      return finalJSON[key] = text
    }
    finalJSON[key] = values[index]
  })

  const outputFilePath = join(OUTPUT_PATH, output)
  log(`Writting file to ${outputFilePath}`)

  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH);
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(finalJSON, null, 2))

  log("Translation done!")
};

const isSuppoortedFileFormat = (translation?: any | null) => typeof Object.values(translation ?? {})?.[0] === "string";

type Options = { target: LangVal | LangKey; source?: LangKey; format?: string }
const main = async (inputFile: string, outputFile: string, options: Options) => {
  const { target, source } = options

  if (!LANGUAGES[target as LangKey]) {
    if (!Object.values(LANGUAGES).includes(target as LangVal)) {
      log(red("Unsupported target language. Visit https://www.deepl.com/docs-api/translating-text/#Request%20Parameters to see what languages are supported."))
      process.exit(1)
    }
  }

  if (!fs.existsSync(inputFile)) {
    log(red("Add your input file as 3rd argument: CLI-NAME <input-file>"))
    process.exit(1)
  }

  log("Reading input", inputFile);
  const jsonString = fs.readFileSync(inputFile).toString();
  try {
    log("Start formatting");
    const jsonFile = JSON.parse(jsonString);
    // format
    if (!isSuppoortedFileFormat(jsonFile)) {
      log(red("Onlu key-value paired JSON format is supported!"))
      process.exit(1)
    }

    log("Translating...");
    const to = LANGUAGES[target as LangKey] || target
    const from = source ? LANGUAGES[source] : undefined
    const output = outputFile ?? createOutputPath({ inputFile, from, to })

    await transform({
      from,
      to,
      output,
      translations: jsonFile,
    });
  } catch (e) {
    log("Unable to parse json file with error", e);
  }
};


// Main entry
const packageJson = require('../package.json')
const { version, name } = packageJson

log(cyan("Thanks for using one-trans.\nMade with ❤️ and 🔥 by OneKey team.\nTo learn more about us, visit our website at https://onekey.so/\n"))

program
  .name(name)
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
