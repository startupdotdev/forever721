import { analyzeMetadata } from "./index";

test("asdfasdf", async () => {
  let result = await analyzeMetadata("ahhh");
  expect(result).toBe(false);
});
