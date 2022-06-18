import { User, UserType } from "../User";

export type Lab = {
  id: string;
  email: string;
  hash: string;
  name: string;
  phone: string;
  address: string;
  publicPhone: string;
  web: string | null;
  publicEmail: string;
  img: string;
  installer: string | null;
  rsaPrivateKey: string;
  createdAt: Date;
  userIds: string[];
  ownerIds: string[];
};
export interface LabWithEmployeeInfo extends Lab {
  Owners: User[];
  Users: User[];
  employees: UserType[];
}
