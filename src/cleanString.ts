// @ts-nocheck
import { stringData, structureData as translatedStructure } from "../test/src/parser/iosString.data";
import { toStrings, toStructuredString } from './parser/iosString';
import { log } from './utils';

const structures = toStructuredString(stringData);

for (const structure of translatedStructure) {
  const originalStructure = structures.find(({ type, value }) => {
    return type === 'pair' && value.key === structure.value.key;
  })

  if (originalStructure) {
    // log('found', originalStructure.value.value);
    // log('replace with', structure.value.value);
    originalStructure.value.value = structure.value.value;
  }
}

// toStrings(structures)
log(toStrings(structures));
