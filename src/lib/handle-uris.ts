import * as Reasons from "../constants/reasons";
import { Buffer } from "buffer";

import { rewriteIpfsUrl } from "./ipfs";
import { isUriIpfs, isUriIpfsPinningService, isUriHttp } from "./check-uris";

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

// Wrapper function around this behavior to make it easier to stub in the tests.
// Likely some benefit to excapsulate request logic here too.
export const fetchMetadata = async (tokenUri: string): Promise<Metadata> => {
  // TODO: What if this fails?
  let response = await fetch(tokenUri);
  let metadata: Metadata = await response.json();

  return metadata;
};

export const handleIpfs = async (tokenUri: string): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsIpfs];

  // Need to rewrite to a HTTP gateway we can fetch
  const ipfsHttpGatewayUrl: string = rewriteIpfsUrl(tokenUri);

  let metadata: Metadata = await fetchMetadata(ipfsHttpGatewayUrl);

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
  let metadata: Metadata = await fetchMetadata(tokenUri);

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

  let metadata: Metadata = await fetchMetadata(tokenUri);

  if (metadata.image) {
    let imageUriReason: Reason | null = handleImageUri(metadata.image);

    if (imageUriReason) {
      reasons = [...reasons, imageUriReason];
    }
  }

  return reasons;
};
