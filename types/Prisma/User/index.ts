export type User = {
  id: string;
  email: string;
  slug: string;
  name: string;
  hash: string;
  profileImg: string | null;
  signature: string | null;
  stamp: string | null;
  createdAt: Date;
  labIds: string[];
  ownerIds: string[];
};
export interface UserType extends User {
  owner: boolean;
}
