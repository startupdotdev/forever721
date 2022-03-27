import { GradeLetter, Severity } from "./constants/enums";

import {
  isUriBase64Json,
  isUriIpfs,
  isUriIpfsPinningService,
  isUriHttp,
} from "./lib/uri-formats";

import {
  handleBase64Json,
  handleIpfs,
  handleIpfsPinningService,
  handleHttp,
} from "./lib/handle-uris";

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
