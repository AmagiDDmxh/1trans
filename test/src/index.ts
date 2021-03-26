import testedModule from "../../";
import test, { ExecutionContext } from "ava";

test('test title', async (t: ExecutionContext) => {
  t.truthy(testedModule(), "No tests, but otherwise fine");
});
