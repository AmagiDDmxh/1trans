import test, { ExecutionContext } from "ava";
import { toStrings, toStructuredString } from "../../../src/parser/iosString";
import { log } from "../../../src/utils";
import {stringData, structureData } from "./iosString.data";


test("iOS String Parser", async (t: ExecutionContext) => {
  t.truthy(
    toStrings(toStructuredString(stringData)) === stringData,
    "Should still the same"
  );

  // t.truthy()
  log(toStrings(structureData));
});
