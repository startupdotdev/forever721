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

const imageUriIsHttp: Reason = {
  id: "image-uri-is-http",
  severity: Severity.Critical,
  message: "ImageURI is hosted on a private server over HTTP",
};

const imageUriIsIpfs: Reason = {
  id: "image-uri-is-ipfs",
  severity: Severity.Good,
  message: "ImageURI is hosted on IPFS",
};

const tokenUriIsIpfsPinningService: Reason = {
  id: "token-uri-is-ipfs-pinning-service",
  severity: Severity.Notice,
  message: "TokenURI is hosted on an IPFS pinning serivce",
};

const imageUriIsIpfsPinningService: Reason = {
  id: "image-uri-is-ipfs-pinning-service",
  severity: Severity.Notice,
  message: "ImageURI is hosted on an IPFS pinning service",
};

export {
  imageOnChain,
  metadataOnChain,
  tokenUriIsIpfs,
  tokenUriIsHttp,
  imageUriIsHttp,
  imageUriIsIpfs,
  tokenUriIsIpfsPinningService,
  imageUriIsIpfsPinningService,
};
