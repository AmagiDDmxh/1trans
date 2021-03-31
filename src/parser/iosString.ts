// const makeString = (metaKey, key, comment) => ({ metaKey, key, comment });

import { structureData } from "../../test/src/parser/iosString.data";
import { log } from "../utils";

const unescapeString = (str) =>
  str.replace('"', '"').replace("\\'", "'").replace("\\\\", "\\");

const REGEX = /\/\*(.*?)\*\/|\/\/\s*(.*?)\s*\n|"(.*?)"\s*=\s*"(.*?)"\s*/gms;

type Formatter = (
  multiComment: string,
  singleComment: string,
  key: string,
  value: string
) => any;

type ParseFunc = (strs: string, formatter: Formatter) => any[];

const defaultFormatter: Formatter = (
  multiComment,
  singleComment,
  key,
  value
) => ({
  [key]: value,
});

export const parse: ParseFunc = (strs, formatter = defaultFormatter) => {
  const result = [];
  // Do something with comment
  // let currentComment = "";

  let multiComment, singleComment, key, value;

  // FIXME: Ts says no matchAll lib error ts(2550)
  // @ts-ignore
  const matchIterator = strs.matchAll(REGEX);
  for ([, multiComment, singleComment, key, value] of matchIterator) {
    const formatted = formatter(multiComment, singleComment, key, value && unescapeString(value))
    result.push(formatted);
  }

  return result;
};

interface Pair {
  key: string;
  value: string;
}

interface StructuredString {
  type: string;
  value: Pair | string;
}

// Transform strings into structured string
export const toStructuredString = (string: string): StructuredString[] => {
  const result = [];

  parse(string, (multiComment, singleComment, key, value) => {
    // log(multiComment, singleComment, key, value);
    if (multiComment) {
      result.push({ type: "multiComment", value: multiComment });
    }
    if (singleComment) {
      result.push({ type: "singleComment", value: singleComment });
    }
    if (value) {
      result.push({ type: "pair", value: { key, value } });
    }
  });

  return result;
};

// Transform structured string into string
export const toStrings = (structuredStrings: StructuredString[]): string => {
  let string = "";

  for (const structuredString of structuredStrings) {
    switch (structuredString.type) {
      case "multiComment":
        string += `/*${structuredString.value}*/\n`;
      case "singleComment":
        string += `// ${structuredString.value}\n`;
      case "pair":
        // @ts-ignore
        string += `"${structuredString.value.key}" = "${structuredString.value.value}"\n`;
    }
  }

  return string;
};

// Transform strings to plain string map
// Be cautious, JSON are unable to parse back
export const toJSON = (string): Record<string, string> => {
  const result = {};
  parse(string, (_, __, key, value) => value && (result[key] = value));
  return result;
};

// log(structureData);
log(toStrings(structureData));
