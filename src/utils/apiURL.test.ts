import { apiURL } from './apiURL';
import { setProject } from '../state';

describe('apiURL()', () => {
  test('should set projectId in url', () => {
    setProject('4444');
    // expect(apiURL()).toBe('https://4444.typesandverbs.com');
    expect(apiURL()).toBe('4444');
  });
});
