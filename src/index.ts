import { User, Ref, Model, ModelTeam, ModelUser, ModelPublic } from './types';
import { getProject, setProject, setUser, setToken } from './state';
import {
  signin,
  signup,
  signout,
  resetPasswordRequest,
  resetPassword,
  updateUser,
  magicLinkRequest,
  magicLinkSignin,
} from './auth';
import { TypesAndVerbsProvider, useUser, useFindOne, useFindMany, useCreate, useUpdate, useRemove } from './hooks/';
import { findMany, findOne, create, update, remove } from './documents';

export const setup = (projectUrl: string) => {
  const project = getProject();
  // if (!projectUrl) throw Error('Project Url is needed to setup');
  // clear token & user if project changes
  if (project !== null && project !== projectUrl) {
    setUser(null);
    setToken(null);
  }
  setProject(projectUrl);
};

export {
  // typescript
  Ref,
  Model,
  ModelTeam,
  ModelUser,
  ModelPublic,
  User,
  // react
  TypesAndVerbsProvider,
  useFindOne,
  useFindMany,
  useCreate,
  useUpdate,
  useRemove,
  // documents
  findMany,
  findOne,
  create,
  update,
  remove,
  // auth
  signin,
  signup,
  signout,
  resetPasswordRequest,
  resetPassword,
  useUser,
  updateUser,
  magicLinkRequest,
  magicLinkSignin,
};
