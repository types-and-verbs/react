import { renderHook, act } from '@testing-library/react-hooks';
import { useFindOne } from './useFindOne';

import { findOne } from '../documents';

// setup mocks
jest.mock('../documents', () => ({
  findOne: jest.fn(),
}));

describe('useFindOne()', () => {
  beforeEach(() => {
    // @ts-ignore
    findOne.mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should be set to loading by default', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindOne('task', { id: '1234' }, {}));

    // should be set to loading to true
    expect(result.current.loading).toEqual(true);
    // @ts-ignore
    expect(findOne.mock.calls[0][0]).toBe('task');
    // @ts-ignore
    expect(findOne.mock.calls[0][1]).toBe('1234');

    await waitForNextUpdate();

    // should set loading to false
    expect(result.current.loading).toEqual(false);
  });

  test('refetch should call findOne()', async () => {
    const {
      result: { current: state },
      waitForNextUpdate,
    } = renderHook(() => useFindOne('task', { id: '1234' }, {}));

    act(() => {
      state.refetch();
    });

    // @ts-ignore
    expect(findOne.mock.calls[0][0]).toBe('task');
    // @ts-ignore
    expect(findOne.mock.calls[0][1]).toBe('1234');

    await waitForNextUpdate();
  });

  test('skip should not call .findOne()', async () => {
    renderHook(() => useFindOne('task', { id: '1234' }, { skip: true }));

    // @ts-ignore
    expect(findOne.mock.calls.length).toBe(0);
  });
});
