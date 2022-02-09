import { Severity } from "./enums";

const metadataOnChain: Reason = {
  severity: Severity.Great,
  message: "Metadata is on-chain",
};

const imageOnChain: Reason = {
  severity: Severity.Great,
  message: "Image is on-chain",
};

export { imageOnChain, metadataOnChain };
