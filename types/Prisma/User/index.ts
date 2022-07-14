export type User = {
  id: string;
  email: string;
  slug: string;
  name: string;
  hash: string;
  createdAt: Date;
  labIds: string[];
  ownerIds: string[];
};
export interface UserType extends User {
  owner: boolean;
}
