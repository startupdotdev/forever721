import { analyzeMetadata, GradeLetter } from "./index";

import { ALL_ON_CHAIN } from "../tests/fixtures/sample_token_uris";

describe("All on chain", () => {
  test("Great example", async () => {
    let result = await analyzeMetadata(ALL_ON_CHAIN);
    expect(result.grade).toBe(GradeLetter.A);
  });
});
