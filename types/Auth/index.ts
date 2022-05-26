export type Auth =
  | {
      "sub-user": string;
    }
  | { "sub-lab": string }
  | { "sub-user": string; "sub-lab": string }
  | null;
