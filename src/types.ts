type ID = string;

export interface User {
  email: string;
  name: string;
  id: ID;
}

export type Ref<T> = T | string;

export interface Model {
  id: ID;
  user: ID | User;
  lastUpdated: string;
  createdAt: string;
}

// tslint:disable-next-line
export interface ModelUser extends Model {}

// tslint:disable-next-line
export interface ModelPublic extends Model {}

export interface ModelTeam extends Model {
  team: ID;
  // editableByTeam: boolean;
}
