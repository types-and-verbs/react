import { setup } from './index';
import { signup, signin, signout, authedUser } from './auth';
import { getUser, getToken, setUser } from './state';
import { post } from './utils/post';

// setup mocks
jest.mock('./utils/post', () => ({
  post: jest.fn(),
}));

setup('1234');

// auth
describe('signup()', () => {
  // @ts-ignore
  post.mockImplementation(async () => ({
    user: { id: '1', name: 'steve', email: 'steve@gmail.com' },
    token: '1234',
  }));

  test('should pass through data', async () => {
    const input = { name: 'steve', email: 'steve@gmail.com', password: 'password' };

    await signup(input);

    // @ts-ignore
    expect(post.mock.calls[0][1].name).toBe(input.name);
    // @ts-ignore
    expect(post.mock.calls[0][1].email).toBe(input.email);
    // @ts-ignore
    expect(post.mock.calls[0][1].password).toBe(input.password);
  });

  test('should set user and token', async () => {
    const input = { name: 'steve', email: 'steve@gmail.com', password: 'password' };
    await signup(input);

    expect(getToken()).toBe('1234');
    expect(getUser()).toEqual({ id: '1', name: 'steve', email: 'steve@gmail.com' });
  });
});

describe('signin()', () => {
  // @ts-ignore
  post.mockImplementation(async () => ({
    user: { id: '1', name: 'steve', email: 'steve@gmail.com' },
    token: '1234',
  }));

  test('should set user and token', async () => {
    const input = { e: 'steve', email: 'steve@gmail.com', password: 'password' };
    await signin(input);

    expect(getToken()).toBe('1234');
    expect(getUser()).toEqual({ id: '1', name: 'steve', email: 'steve@gmail.com' });
  });
});

describe('authedUser()', () => {
  test('should return authed user', () => {
    const user = {
      id: '1234',
      name: 'sarah',
      email: 'sarah@gmail.com',
    };
    setUser(user);
    expect(authedUser()).toEqual(user);
  });
});

describe.skip('signout()', () => {
  test('should clear user and token', () => {
    signout();
    expect(getUser()).toBe(null);
    expect(getToken()).toBe(null);
  });
});

describe.skip('resetPasswordRequest()', () => {
  test('', () => {
    expect(true).toBe(true);
  });
});

describe.skip('resetPassword()', () => {
  test('should clear user and token', () => {
    expect(true).toBe(true);
  });
});
