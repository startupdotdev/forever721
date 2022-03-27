import * as Reasons from "../constants/reasons";
import axios from "axios";

import { rewriteIpfsUrl } from "./utils/ipfs";
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
