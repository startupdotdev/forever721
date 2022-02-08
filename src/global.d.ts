interface Grade {
  grade: GradeLetter;
  reasons: Reason[];
}

interface Reason {
  severity: Severity;
  message: string;
}
