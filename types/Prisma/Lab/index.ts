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
  preferences: Partial<LabPreferences>;
  createdAt: Date;
  userIds: string[];
  ownerIds: string[];
};
export type LabPreferences = {
  useTestCustomId: boolean;
  leadingZerosWhenCustomId: number;
  useQR: boolean;
};
export interface LabWithEmployeeInfo extends Lab {
  Owners: User[];
  Users: User[];
  employees: UserType[];
}

export type LabSelect = {
  [key in keyof Partial<Lab>]: boolean;
};
