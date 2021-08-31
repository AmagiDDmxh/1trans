import test from 'ava';
import { createOutputPath } from '../../src/utils'

const to = 'de'

test('createOutputPath with correct arguments', t => {
  const inputFile1 = 'hello-en.json'
  const inputFile2 = 'hello.en.json'

  t.is(createOutputPath({ inputFile: inputFile1, to }), `hello-${to}.json`)
  t.is(createOutputPath({ inputFile: inputFile2, to }), `hello.${to}.json`)
});
