import { GradeLetter, Severity } from "./constants/enums";
import { analyzeTokenUri } from "./index";

import { ALL_ON_CHAIN } from "../tests/fixtures/sample_token_uris";

describe("All on chain", () => {
  test("base64 encoded json", async () => {
    let result = await analyzeTokenUri(ALL_ON_CHAIN);

    expect(result.grade).toBe(GradeLetter.A);
    expect(result.reasons.length).toEqual(2);

    const expectedReason1: Reason = {
      severity: Severity.Great,
      message: "Metadata is on-chain",
    };
    const expectedReason2: Reason = {
      severity: Severity.Great,
      message: "Image is on-chain",
    };

    const reason1 = result.reasons.find(
      (reason) => reason.message == "Metadata is on-chain"
    );
    const reason2 = result.reasons.find(
      (reason) => reason.message == "Image is on-chain"
    );

    expect(reason1).toMatchObject(expectedReason1);
    expect(reason2).toMatchObject(expectedReason2);
  });
});
