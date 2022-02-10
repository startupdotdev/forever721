import { Severity } from "./enums";

const metadataOnChain: Reason = {
  id: "metadata-on-chain",
  severity: Severity.Great,
  message: "Metadata is on-chain",
};

const imageOnChain: Reason = {
  id: "image-on-chain",
  severity: Severity.Great,
  message: "Image is on-chain",
};

const tokenUriIsIPFS: Reason = {
  id: "token-uri-is-ipfs",
  severity: Severity.Good,
  message: "TokenURI is hosted on IPFS",
};

export { imageOnChain, metadataOnChain, tokenUriIsIPFS };
