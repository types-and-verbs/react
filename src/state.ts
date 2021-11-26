import { authObserver } from './observable';
import { User } from './types';
import safelyParseJSON from './utils/safety-parse-json';

const tokenHandle = '@types-and-verbs';

function getFromStorage(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return safelyParseJSON(window.localStorage.getItem(`${tokenHandle}/${key}`));
  }
}

function setInStorage(key: string, val: any) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.setItem(`${tokenHandle}/${key}`, JSON.stringify(val));
  }
}

let project: string | null = getFromStorage('project-url');
let token: string | null = getFromStorage('token');
let user: User | null = getFromStorage('user');

export function getToken() {
  return token;
}

export function setToken(val: string | null) {
  token = val;
  if (typeof window !== 'undefined' && window.localStorage) {
    // TODO save to localstorage (won't work for react-native)
    setInStorage(`token`, val);
  }
}

export function getUser() {
  return user;
}

export function setUser(val: User | null) {
  user = val;
  authObserver.notify(val);
  if (typeof window !== 'undefined' && window.localStorage) {
    setInStorage(`user`, val);
  }
}

export function getProject() {
  return project;
}

export function setProject(val: string) {
  project = val;
}
