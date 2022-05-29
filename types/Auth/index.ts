export type Auth =
  | { "sub-user": string; "sub-lab": string; sub: string }
  | { sub: string; "sub-user": string; "sub-lab": undefined }
  | { sub: string; "sub-lab": string; "sub-user": undefined }
  | null;
