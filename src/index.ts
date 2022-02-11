import { GradeLetter, Severity } from "./constants/enums";
import * as Reasons from "./constants/reasons";
import axios from "axios";

export const isUriBase64Json = (tokenUri: string): boolean => {
  return tokenUri.startsWith("data:application/json;base64");
};

export const isUriIpfs = (tokenUri: string): boolean => {
  return tokenUri.startsWith("ipfs");
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

export const handleIpfs = async (tokenUri: string): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsIpfs];

  // TODO: What if this fails?
  let res: Metadata = await axios.get(tokenUri);

  if (res.image && isUriIpfs(res.image)) {
    reasons = [...reasons, Reasons.imageUriIsIpfs];
  } else if (res.image && isUriHttp(res.image)) {
    reasons = [...reasons, Reasons.imageUriIsHttp];
  }

  return reasons;
};

export const handleHttp = async (tokenUri: string): Promise<Reason[]> => {
  let reasons: Reason[] = [Reasons.tokenUriIsHttp];

  // TODO: What if this fails?
  let res: Metadata = await axios.get(tokenUri);

  if (res.image && isUriHttp(res.image)) {
    reasons = [...reasons, Reasons.imageUriIsHttp];
  }

  return reasons;
};

const analyzeTokenUri = async (tokenUri: string): Promise<Grade> => {
  let reasons: Reason[] = [];

  if (isUriBase64Json(tokenUri)) {
    reasons = handleBase64Json(tokenUri);
  } else if (isUriIpfs(tokenUri)) {
    reasons = await handleIpfs(tokenUri);
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

export { analyzeTokenUri };
