import { GradeLetter, Severity } from "./constants/enums";
import {
  imageOnChain,
  metadataOnChain,
  tokenUriIsIPFS,
} from "./constants/reasons";

import { analyzeTokenUri } from "./index";

import { ALL_ON_CHAIN } from "../tests/fixtures/sample_token_uris";

describe("All on chain", () => {
  test("base64 encoded json", async () => {
    let result = await analyzeTokenUri(ALL_ON_CHAIN);

    expect(result.grade).toBe(GradeLetter.A);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === metadataOnChain.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageOnChain.id
    );

    console.log(reason2);

    expect(reason1).toMatchObject(metadataOnChain);
    expect(reason2).toMatchObject(imageOnChain);
  });
});

describe("IPFS token URI", () => {
  test("IPFS url as the top level", async () => {
    let result = await analyzeTokenUri("ipfs://bafybeic26wp7ck2/1234");

    expect(result.grade).toBe(GradeLetter.B);
    expect(result.reasons.length).toEqual(1);

    const reason = result.reasons.find(
      (reason) => reason.id === tokenUriIsIPFS.id
    );

    expect(reason).toMatchObject(tokenUriIsIPFS);
  });
});
