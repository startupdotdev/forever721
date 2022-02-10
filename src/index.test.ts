import { GradeLetter, Severity } from "./constants/enums";
import {
  imageOnChain,
  imageUriIsHttp,
  metadataOnChain,
  tokenUriIsHttp,
  tokenUriIsIpfs,
} from "./constants/reasons";

import { analyzeTokenUri, isTokenUriBase64Json, isTokenUriHttp } from "./index";

import {
  ALL_ON_CHAIN,
  HTTP_WITH_HTTP_RESPONSE,
} from "../tests/fixtures/sample_token_uris";

import axios from "axios";
jest.mock("axios");

describe("#isTokenUriBase64Json", () => {
  test("valid base64", async () => {
    expect(
      isTokenUriBase64Json("data:application/json;base64asdlfkjasdlkfjasdf=")
    ).toBe(true);
  });
  test("invalid base64", async () => {
    expect(
      isTokenUriBase64Json("data:application/ping;base64asdlfkjasdlkfjasdf=")
    ).toBe(false);
  });
});

describe("#isTokenUriHttp", () => {
  test("valid http", async () => {
    expect(isTokenUriHttp("http://lazy.llamas")).toBe(true);
    expect(isTokenUriHttp("https://lazy.llamas")).toBe(true);
  });
  test("invalid http", async () => {
    expect(isTokenUriHttp("ftp://something")).toBe(false);
    expect(isTokenUriHttp("ipfs://somethingalsdkfjas/1234")).toBe(false);
    expect(isTokenUriHttp("data:application/json;base64hotdog=")).toBe(false);
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

describe("IPFS tokenURI", () => {
  test("IPFS url as the top level", async () => {
    let result = await analyzeTokenUri("ipfs://bafybeic26wp7ck2/1234");

    expect(result.grade).toBe(GradeLetter.B);
    expect(result.reasons.length).toEqual(1);

    const reason = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfs.id
    );

    expect(reason).toMatchObject(tokenUriIsIpfs);
  });
});

describe("HTTP link for tokenURI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Random URL at top level results in poor grad", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(HTTP_WITH_HTTP_RESPONSE);
    let result = await analyzeTokenUri("https://lazy.llamas/449");
    expect(result.reasons.length).toEqual(2);
    expect(axios.get).toHaveBeenCalledWith("https://lazy.llamas/449");
    expect(result.grade).toBe(GradeLetter.F);

    let reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsHttp.id
    );
    expect(reason1).toMatchObject(tokenUriIsHttp);

    let reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsHttp.id
    );
    expect(reason2).toMatchObject(imageUriIsHttp);
  });
});

describe("No matching formats found", () => {
  test("TokenUri passed that doesn't match supported format", async () => {
    await expect(analyzeTokenUri("lazy://falcon.club")).rejects.toThrow();
  });
});
