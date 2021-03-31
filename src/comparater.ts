// import { log } from "./utils";
// import source from "../desktop-zh-translations.json";
// import target from "../desktop-en.translations.json";

export const compare = (source, target, formatter = (i) => i) => {
  const keys = Object.keys(source);
  const result = {};

  for (const key of keys) {
    if (!target.hasOwnProperty(key)) {
      result[key] = formatter(source[key]);
    }
  }

  return result;
};

// Unable to use right now
export const diff = (source: string, target: string) => {
  return helper(source, target, 0, 0);

  function helper(
    source: string,
    target: string,
    sourceIndex: number,
    targetIndex: number
  ): string {
    const resultHelper = (sourceIndexInner, targetIndexInner) =>
      helper(source, target, sourceIndexInner, targetIndexInner);

    const whenDifferentChars = (sourceIndexInner, targetIndexInner) => {
      const resultA = resultHelper(sourceIndexInner + 1, targetIndexInner);
      const resultB = resultHelper(sourceIndexInner, targetIndexInner + 1);
      return resultA.length > resultB.length ? resultA : resultB;
    };

    if (source.length === sourceIndex || target.length === targetIndex) {
      return "";
    }

    if (source.charAt(sourceIndex) === target.charAt(targetIndex)) {
      return `${source.charAt(sourceIndex)}${resultHelper(
        sourceIndex + 1,
        targetIndex + 1
      )}`;
      return result;
    }

    return whenDifferentChars(sourceIndex, targetIndex);
  }
};

// log(compare(source, target));
// const stringify = (obj: Object) => JSON.stringify(obj, null, 2);
// log(diff(stringify(source), stringify(target)));
