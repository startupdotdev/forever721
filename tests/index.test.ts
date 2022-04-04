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

import {
  isUriBase64Json,
  isUriIpfs,
  isUriIpfsPinningService,
  isUriHttp,
} from "../src/lib/check-uris";

import { handleImageUri } from "../src/lib/handle-uris";
import { analyzeTokenUri } from "../src/index";

import {
  ALL_ON_CHAIN,
  IMAGE_IS_HTTP_RESPONSE,
  IMAGE_IS_IPFS_RESPONSE,
  IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE,
  IPFS_GATEWAY_IMAGE_IS_HTTP_RESPONSE,
  IPFS_PINNING_SERVICE_IMAGE_IS_IPFS_PINNING_SERVICE_RESPONSE,
} from "./fixtures/sample_token_uris";

import fetch from "cross-fetch";
jest.mock("cross-fetch", () => {
  //Mock the default export
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

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

describe("#isUriIpfs", () => {
  test("ipfs://", async () => {
    expect(isUriIpfs("ipfs://abcdef/12354.png")).toBe(true);

    expect(isUriIpfs("https://lazy.llamas/ipfs")).toBe(false);
    expect(isUriIpfs("https://lazy.llamas")).toBe(false);
  });

  test("ipfs gateway", async () => {
    expect(isUriIpfs("http://ipfs.io/ipfs/abcdef/12354.png")).toBe(true);
    expect(isUriIpfs("https://ipfs.io/ipfs/abcdef/12354.png")).toBe(true);

    expect(isUriIpfs("https://lazy.llamas")).toBe(false);
    expect(isUriIpfs("ftp://something")).toBe(false);
    expect(isUriIpfs("data:application/json;base64hotdog=")).toBe(false);
  });
});

describe("#isUriIpfsPinningService", () => {
  test("pinning service", async () => {
    expect(
      isUriIpfsPinningService("https://ikzttp.mypinata.cloud/ipfs/abcdef/1234")
    ).toBe(true);
    expect(isUriIpfsPinningService("https://crust.network/abcdef/1234")).toBe(
      true
    );

    expect(
      isUriIpfsPinningService("http://ipfs.io/ipfs/abcdef/12354.png")
    ).toBe(false);
    expect(
      isUriIpfsPinningService("https://ipfs.io/ipfs/abcdef/12354.png")
    ).toBe(false);
    expect(isUriIpfsPinningService("https://lazy.llamas")).toBe(false);
    expect(isUriIpfsPinningService("ftp://something")).toBe(false);
    expect(isUriIpfsPinningService("data:application/json;base64hotdog=")).toBe(
      false
    );
  });
});

describe("#handleImageUri", () => {
  test("it handles the various Uri formats", async () => {
    expect(handleImageUri("ipfs://abcdef/1234.png")).toBe(imageUriIsIpfs);
    expect(handleImageUri("http://ipfs.io/ipfs/abcdef/1234.png")).toBe(
      imageUriIsIpfs
    );
    expect(handleImageUri("https://infura.io/ipfs/abcdef/1234.png")).toBe(
      imageUriIsIpfsPinningService
    );
    expect(handleImageUri("https://api.lazylions.com/1234.png")).toBe(
      imageUriIsHttp
    );
    expect(handleImageUri("unsupported.format/1234.png")).toBe(null);
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IPFS_PINNING_SERVICE_IMAGE_IS_IPFS_PINNING_SERVICE_RESPONSE;
      },
    });

    let result = await analyzeTokenUri(
      "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/1948"
    );

    expect(fetch).toHaveBeenCalledWith(
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("https://ipfs.io/ipfs/blabhalsdkj/1234");

    expect(fetch).toHaveBeenCalledWith("https://ipfs.io/ipfs/blabhalsdkj/1234");
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(fetch).toHaveBeenCalledWith("https://ipfs.io/ipfs/blabhalsdkj/1234");
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IPFS_GATEWAY_IMAGE_IS_IPFS_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(fetch).toHaveBeenCalledWith("https://ipfs.io/ipfs/blabhalsdkj/1234");
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IPFS_GATEWAY_IMAGE_IS_HTTP_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("ipfs://blabhalsdkj/1234");

    expect(fetch).toHaveBeenCalledWith("https://ipfs.io/ipfs/blabhalsdkj/1234");
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
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IMAGE_IS_IPFS_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("https://lazy.llamas/449");

    expect(fetch).toHaveBeenCalledWith("https://lazy.llamas/449");
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

  test("Random URL at top level results in poor grade", async () => {
    // @ts-ignore
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => {
        return IMAGE_IS_HTTP_RESPONSE;
      },
    });

    let result = await analyzeTokenUri("https://lazy.llamas/449");
    expect(result.reasons.length).toEqual(2);
    expect(fetch).toHaveBeenCalledWith("https://lazy.llamas/449");
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
