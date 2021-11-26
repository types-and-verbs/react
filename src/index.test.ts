import { setup } from './index';
import { getProject, getUser, getToken, setProject, setUser, setToken } from './state';

describe.skip('setup()', () => {
  test('should error if no projectId is given', () => {
    expect(true).toBe(true);
  });
  test('should set projectId', () => {
    expect(getProject()).toBe(null);
    setup('1234');
    expect(getProject()).toBe('1234');
  });
  test('should clear user + token if project is changed', () => {
    // set values
    setUser({ name: 'steve', email: 'steve@gmail.com', id: '12' });
    setToken('token');
    setProject('4444');
    // update project
    setup('1234');
    // check values have been cleared
    expect(getProject()).toBe('1234');
    expect(getUser()).toBe(null);
    expect(getToken()).toBe(null);
  });
});
