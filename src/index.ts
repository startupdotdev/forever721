import { GradeLetter } from "./constants/enums";
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

  return await {
    grade: GradeLetter.F,
    reasons: reasons,
  };
};

export { analyzeTokenUri };
