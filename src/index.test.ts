import { GradeLetter, Severity } from "./constants/enums";
import {
  imageOnChain,
  metadataOnChain,
  tokenUriIsIPFS,
} from "./constants/reasons";

import { analyzeTokenUri, isTokenUriBase64Json } from "./index";

import { ALL_ON_CHAIN } from "../tests/fixtures/sample_token_uris";

describe("#isTokenUriBase64Json", () => {
  test("valid base4", async () => {
    expect(
      isTokenUriBase64Json("data:application/json;base64asdlfkjasdlkfjasdf=")
    ).toBe(true);
  });
  test("invalid base4", async () => {
    expect(
      isTokenUriBase64Json("data:application/ping;base64asdlfkjasdlkfjasdf=")
    ).toBe(false);
  });
});

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

describe("No matching formats found", () => {
  test("TokenUri passed that doesn't match supported format", async () => {
    await expect(analyzeTokenUri("lazy://falcon.club")).rejects.toThrow();
  });
});
