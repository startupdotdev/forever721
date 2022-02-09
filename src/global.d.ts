interface Grade {
  grade: GradeLetter;
  reasons: Reason[];
}

interface Reason {
  severity: Severity;
  message: string;
}

interface Metadata {
  image?: string;
}
