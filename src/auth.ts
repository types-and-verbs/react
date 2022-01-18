import { User } from './types';
import { getUser, setUser, setToken } from './state';
import { apiURL } from './utils/apiURL';
import { post } from './utils/post';
import request from './utils/request';

export interface AuthRes {
  token: string;
  user: User;
}

export async function signup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthRes> {
  return post(`${apiURL()}/signup`, { email, password, name }).then(async (res) => {
    setToken(res.token);
    setUser(res.user);
    return res;
  });
}

export async function signin({ email, password }: { email: string; password: string }): Promise<AuthRes> {
  return post(`${apiURL()}/signin`, { email, password }).then(async (res) => {
    setToken(res.token);
    setUser(res.user);
    return res;
  });
}

export const authedUser = () => getUser();

export async function fetchUser() {
  const url = `${apiURL()}/user`;

  try {
    const user = await request({ url, method: 'GET' });
    setUser(user);
    return user;
  } catch (err: any) {
    console.error(err);
    if (err?.message === 'Not authorized') {
      setUser(null);
      setToken(null);
    }
  }
}

export async function updateUser(data: object) {
  const url = `${apiURL()}/user`;

  try {
    const user = await request({ url, method: 'POST', data });
    setUser(user);
    return user;
  } catch (err) {
    console.error(err);
  }
}

export function signout() {
  setUser(null);
  setToken(null);
  // TODO remove from localstorage (won't work for react-native)
}

export function resetPasswordRequest({ email }: { email: string }) {
  const url = `${apiURL()}/forgot`;
  return post(url, { email });
}

export async function resetPassword({ token, password }: { token: string; password: string }) {
  return post(`${apiURL()}/reset`, { token, password }).then(async (res) => {
    setToken(res.token);
    setUser(res.user);
    return res;
  });
}

export function magicLinkRequest({ email }: { email: string }) {
  const url = `${apiURL()}/magiclink_request`;
  return post(url, { email });
}

export async function magicLinkSignin({ token }: { token: string }) {
  return post(`${apiURL()}/magiclink_signin`, { token }).then(async (res) => {
    setToken(res.token);
    setUser(res.user);
    return res;
  });
}
