export type User = {
  id: string;
  email: string;
  slug: string;
  name: string;
  hash: string;
  profileImg: string | null;
  createdAt: Date;
  labIds: string[];
  ownerIds: string[];
};
