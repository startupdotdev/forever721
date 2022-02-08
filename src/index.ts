export enum GradeLetter {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  F = "F",
}

export enum Severity {
  Critical = -3,
  Bad = -1,
  Notice = 0,
  Good = 1,
  Great = 2,
}

const analyzeMetadata = async (tokenUri: string): Promise<Grade> => {
  return await {
    grade: GradeLetter.F,
    reasons: [
      {
        severity: Severity.Critical,
        message: "EMOTIONAL",
      },
      {
        severity: Severity.Critical,
        message: "DAMAGE",
      },
    ],
  };
};

export { analyzeMetadata };
