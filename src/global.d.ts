interface Grade {
  grade: GradeLetter;
  reasons: Reason[];
}

interface Reason {
  id: string;
  severity: Severity;
  message: string;
}

interface Metadata {
  image?: string;
}
