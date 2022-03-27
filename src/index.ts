import { GradeLetter, Severity } from "./constants/enums";
import * as Reasons from "./constants/reasons";
import axios from "axios";

export const isUriBase64Json = (tokenUri: string): boolean => {
  return tokenUri.startsWith("data:application/json;base64");
};

export const isUriIpfs = (tokenUri: string): boolean => {
  return tokenUri.startsWith("ipfs") || tokenUri.includes("ipfs.io/ipfs");
};

const ipfsPinningServices = [
  "mypinata.cloud",
  "eternum.io",
  "crust.network",
  "infura.io",
  "estuary.tech",
  "web3.storage",
  "nft.storage",
];

export const isUriIpfsPinningService = (tokenUri: string): boolean => {
  for (let service of ipfsPinningServices) {
    if (tokenUri.includes(service)) {
      return true;
    }
  }

  return false;
};

export const isUriHttp = (tokenUri: string): boolean => {
  return tokenUri.startsWith("http");
};

export const handleBase64Json = (tokenUri: string): Reason[] => {
  let reasons: Reason[] = [Reasons.metadataOnChain];

  const encodedData: string = tokenUri.split("data:application/json;base64")[1];
  const decodedBuffer: Buffer = Buffer.from(encodedData, "base64");
  const decodedString: string = decodedBuffer.toString();
  const json: Metadata = JSON.parse(decodedString);

  // todo: what if no image?
  const imageAttribute = json.image || "";

  if (imageAttribute.startsWith("data:image")) {
    reasons = [...reasons, Reasons.imageOnChain];
  }

  return reasons;
};

const rewriteIpfsUrl = (url: string): string => {
  if (!url || url.startsWith("ipfs://") === false) {
    return url;
  }

  // Rewrites:
  // ipfs://abcde...xyz/1234.png -> https://ipfs.io/ipfs/abcde...xyz/1234.png
  let ipfsRegex = /ipfs:\/\/(.+)/;

  // @ts-ignore
  let [_, capture] = ipfsRegex.exec(url);
  let urlData: string = capture;

  return `https://ipfs.io/ipfs/${urlData}`;
};

export const handleImageUri = (imageUri: string): Reason | null => {
  if (isUriIpfs(imageUri)) {
    return Reasons.imageUriIsIpfs;
  } else if (isUriIpfsPinningService(imageUri)) {
    return Reasons.imageUriIsIpfsPinningService;
  } else if (isUriHttp(imageUri)) {
    return Reasons.imageUriIsHttp;
  }

  return null;
};

export const handleIpfs = async (tokenUri: string): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsIpfs];

  // Need to rewrite to a HTTP gateway we can fetch
  const ipfsHttpGatewayUrl: string = rewriteIpfsUrl(tokenUri);

  // TODO: What if this fails?
  let { data } = await axios.get(ipfsHttpGatewayUrl);
  let metadata: Metadata = data;

  if (metadata.image) {
    let imageUriReason: Reason | null = handleImageUri(metadata.image);

    if (imageUriReason) {
      reasons = [...reasons, imageUriReason];
    }
  }

  return reasons;
};

export const handleIpfsPinningService = async (
  tokenUri: string
): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsIpfsPinningService];

  // TODO: What if this fails?
  let { data } = await axios.get(tokenUri);
  let metadata: Metadata = data;

  if (metadata.image) {
    let imageUriReason: Reason | null = handleImageUri(metadata.image);

    if (imageUriReason) {
      reasons = [...reasons, imageUriReason];
    }
  }

  return reasons;
};

export const handleHttp = async (tokenUri: string): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsHttp];

  // TODO: What if this fails?
  let metadata: Metadata = await axios.get(tokenUri);

  if (metadata.image) {
    let imageUriReason: Reason | null = handleImageUri(metadata.image);

    if (imageUriReason) {
      reasons = [...reasons, imageUriReason];
    }
  }

  return reasons;
};

export const analyzeTokenUri = async (tokenUri: string): Promise<Grade> => {
  let reasons: Reason[] = [];

  if (isUriBase64Json(tokenUri)) {
    reasons = handleBase64Json(tokenUri);
  } else if (isUriIpfs(tokenUri)) {
    reasons = await handleIpfs(tokenUri);
  } else if (isUriIpfsPinningService(tokenUri)) {
    reasons = await handleIpfsPinningService(tokenUri);
  } else if (isUriHttp(tokenUri)) {
    reasons = await handleHttp(tokenUri);
  } else {
    throw new Error("Token URI format not supported");
  }

  const scoreSum: number = reasons.reduce((acc, { severity }) => {
    return acc + severity;
  }, 0);
  const score: number = scoreSum / reasons.length;

  let grade;

  if (score >= Severity.Great) {
    grade = GradeLetter.A;
  } else if (score >= Severity.Good) {
    grade = GradeLetter.B;
  } else if (score >= Severity.Notice) {
    grade = GradeLetter.C;
  } else if (score >= Severity.Bad) {
    grade = GradeLetter.D;
  } else {
    grade = GradeLetter.F;
  }

  return await {
    grade: grade,
    reasons: reasons,
  };
};
