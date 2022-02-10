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

const tokenUriIsIpfs: Reason = {
  id: "token-uri-is-ipfs",
  severity: Severity.Good,
  message: "TokenURI is hosted on IPFS",
};

const tokenUriIsHttp: Reason = {
  id: "token-uri-is-http",
  severity: Severity.Critical,
  message: "TokenURI is hosted on a private server over HTTP",
};

export { imageOnChain, metadataOnChain, tokenUriIsIpfs, tokenUriIsHttp };
