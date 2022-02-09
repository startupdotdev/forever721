import { GradeLetter, Severity } from "./constants/enums";
import * as Reasons from "./constants/reasons";

const analyzeTokenUri = async (tokenUri: string): Promise<Grade> => {
  let reasons: Reason[] = [];

  if (tokenUri.startsWith("data:application/json;base64")) {
    reasons = [...reasons, Reasons.metadataOnChain];
  }

  const encodedData: string = tokenUri.split("data:application/json;base64")[1];
  const decodedBuffer: Buffer = Buffer.from(encodedData, "base64");
  const decodedString: string = decodedBuffer.toString();
  const json: Metadata = JSON.parse(decodedString);

  // todo: what if no image?
  const imageAttribute = json.image || "";

  if (imageAttribute.startsWith("data:image")) {
    reasons = [...reasons, Reasons.imageOnChain];
  }

  const scoreSum: number = reasons
    .map((reason) => reason.severity)
    .reduce((a, b) => a + b);
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
