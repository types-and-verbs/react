import React, { useState, createContext, useContext, useEffect } from 'react';

import { setup } from '../index';
import { authedUser, fetchUser } from '../auth';
import { authObserver } from '../observable';
import { User } from '../types';
import { getToken } from '../state';

interface AuthState {
  // [key: string]: any;
  loading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthState>({
  loading: true,
  user: authedUser(),
});

export interface ProviderProps {
  projectUrl: string;
}

export const TypesAndVerbsProvider: React.FC<ProviderProps> = ({ children, projectUrl }) => {
  if (!projectUrl) throw Error('TypesAndVerbsProvider requires an projectUrl');
  setup(projectUrl);

  // useEffect(() => {
  // if (!projectUrl) throw Error('TypesAndVerbsProvider requires an projectUrl id');
  // }, [projectUrl]);

  const [state, setState] = useState<AuthState>({
    loading: true,
    user: authedUser(),
  });

  useEffect(() => {
    // only get if there is a token
    if (getToken()) {
      fetchUser();
    } else {
      setState({ ...state, loading: false });
    }
  }, []);

  function authListener(user: User | null) {
    setState({ ...state, user, loading: false });
  }

  useEffect(() => {
    authObserver.add(authListener);
    return () => {
      authObserver.remove(authListener);
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useUser = (): AuthState => {
  const state = useContext(AuthContext);

  return state;
};
