import { GradeLetter, Severity } from "../src/constants/enums";
import {
  imageOnChain,
  imageUriIsHttp,
  metadataOnChain,
  tokenUriIsHttp,
  tokenUriIsIpfs,
  imageUriIsIpfs,
  tokenUriIsIpfsPinningService,
  imageUriIsIpfsPinningService,
} from "../src/constants/reasons";

import { analyzeTokenUri, isUriBase64Json, isUriHttp } from "../src/index";

import {
  ALL_ON_CHAIN,
  IMAGE_IS_HTTP_RESPONSE,
  IMAGE_IS_IPFS_RESPONSE,
  IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE,
  IPFS_GATEWAY_IMAGE_IS_HTTP_RESPONSE,
  IPFS_PINNING_SERVICE_IMAGE_IS_IPFS_PINNING_SERVICE_RESPONSE,
} from "./fixtures/sample_token_uris";

import axios from "axios";
jest.mock("axios");

afterEach(() => {
  jest.clearAllMocks();
});

describe("#isUriBase64Json", () => {
  test("valid base64", async () => {
    expect(
      isUriBase64Json("data:application/json;base64asdlfkjasdlkfjasdf=")
    ).toBe(true);
  });
  test("invalid base64", async () => {
    expect(
      isUriBase64Json("data:application/ping;base64asdlfkjasdlkfjasdf=")
    ).toBe(false);
  });
});

describe("#isUriHttp", () => {
  test("valid http", async () => {
    expect(isUriHttp("http://lazy.llamas")).toBe(true);
    expect(isUriHttp("https://lazy.llamas")).toBe(true);
  });
  test("invalid http", async () => {
    expect(isUriHttp("ftp://something")).toBe(false);
    expect(isUriHttp("ipfs://somethingalsdkfjas/1234")).toBe(false);
    expect(isUriHttp("data:application/json;base64hotdog=")).toBe(false);
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

describe("IPFS pinning service tokenURI", () => {
  test("with an IPFS pinning service", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(
      IPFS_PINNING_SERVICE_IMAGE_IS_IPFS_PINNING_SERVICE_RESPONSE
    );

    let result = await analyzeTokenUri(
      "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/1948"
    );

    expect(axios.get).toHaveBeenCalledWith(
      "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/1948"
    );
    expect(result.grade).toBe(GradeLetter.C);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfsPinningService.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsIpfsPinningService.id
    );

    expect(reason1).toMatchObject(tokenUriIsIpfsPinningService);
    expect(reason2).toMatchObject(imageUriIsIpfsPinningService);
  });
});

describe("IPFS tokenURI", () => {
  test("with an IPFS HTTP gateway URL", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE);

    let result = await analyzeTokenUri("https://ipfs.io/ipfs/blabhalsdkj/1234");

    expect(axios.get).toHaveBeenCalledWith(
      "https://ipfs.io/ipfs/blabhalsdkj/1234"
    );
    expect(result.grade).toBe(GradeLetter.B);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfs.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsIpfs.id
    );

    expect(reason1).toMatchObject(tokenUriIsIpfs);
    expect(reason2).toMatchObject(imageUriIsIpfs);
  });

  test("rewrites IPFS with IPFS URL for the image", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE);

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(axios.get).toHaveBeenCalledWith(
      "https://ipfs.io/ipfs/blabhalsdkj/1234"
    );
    expect(result.grade).toBe(GradeLetter.B);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfs.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsIpfs.id
    );

    expect(reason1).toMatchObject(tokenUriIsIpfs);
    expect(reason2).toMatchObject(imageUriIsIpfs);
  });

  test("with IPFS URL for the image", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE);

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(axios.get).toHaveBeenCalledWith(
      "https://ipfs.io/ipfs/blabhalsdkj/1234"
    );
    expect(result.grade).toBe(GradeLetter.B);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfs.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsIpfs.id
    );

    expect(reason1).toMatchObject(tokenUriIsIpfs);
    expect(reason2).toMatchObject(imageUriIsIpfs);
  });

  test("with rando server URL for the image", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IPFS_GATEWAY_IMAGE_IS_HTTP_RESPONSE);

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(axios.get).toHaveBeenCalledWith(
      "https://ipfs.io/ipfs/blabhalsdkj/1234"
    );
    expect(result.grade).toBe(GradeLetter.D);
    expect(result.reasons.length).toEqual(2);

    const reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsIpfs.id
    );
    const reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsHttp.id
    );

    expect(reason1).toMatchObject(tokenUriIsIpfs);
    expect(reason2).toMatchObject(imageUriIsHttp);
  });
});

describe("HTTP link for tokenURI", () => {
  test("with IPFS image URL", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IMAGE_IS_IPFS_RESPONSE);

    let result = await analyzeTokenUri("https://lazy.llamas/449");

    expect(axios.get).toHaveBeenCalledWith("https://lazy.llamas/449");
    expect(result.grade).toBe(GradeLetter.D);
    expect(result.reasons.length).toEqual(2);

    let reason1 = result.reasons.find(
      (reason) => reason.id === tokenUriIsHttp.id
    );
    expect(reason1).toMatchObject(tokenUriIsHttp);

    let reason2 = result.reasons.find(
      (reason) => reason.id === imageUriIsIpfs.id
    );
    expect(reason2).toMatchObject(imageUriIsIpfs);
  });

  test("Random URL at top level results in poor grad", async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce(IMAGE_IS_HTTP_RESPONSE);
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
