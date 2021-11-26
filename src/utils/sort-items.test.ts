import { sortItems } from './sort-items';
import { Model } from '../types';

interface Task extends Model {
  name: string;
  amount: number;
  done: boolean;
}

const user = { id: '1', name: '', email: '' };

const items: Task[] = [
  {
    id: '0',
    name: 'a',
    lastUpdated: '2020-01-18T16:24:35.796Z',
    createdAt: '2020-11-18T16:24:35.796Z',
    done: false,
    user,
    amount: 3,
  },
  {
    id: '1',
    name: 'b',
    lastUpdated: '2020-02-18T16:24:35.796Z',
    createdAt: '2020-11-18T16:24:35.796Z',
    done: false,
    user,
    amount: 100,
  },
  {
    id: '2',
    name: 'c',
    lastUpdated: '2020-03-18T16:24:35.796Z',
    createdAt: '2020-11-18T16:24:35.796Z',
    done: true,
    user,
    amount: 80,
  },
  {
    id: '4',
    name: 'd',
    lastUpdated: '2020-05-18T16:24:35.796Z',
    createdAt: '2020-11-18T16:24:35.796Z',
    done: true,
    user,
    amount: 20,
  },
  {
    id: '5',
    name: 'e',
    lastUpdated: '2020-06-18T16:24:35.796Z',
    createdAt: '2020-11-18T16:24:35.796Z',
    done: false,
    user,
    amount: -10,
  },
];

describe('add-to-items', () => {
  it('should order strings ASC', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-11-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: false,
      user,
      amount: 10,
    };
    const orderBy = 'id';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.id);

    expect(sorted[0]).toBe('0');
    expect(sorted[1]).toBe('1');
    expect(sorted[2]).toBe('2');
    expect(sorted[3]).toBe('3');
    expect(sorted[4]).toBe('4');
    expect(sorted[5]).toBe('5');
  });

  it('should order strings DESC', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-11-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: false,
      user,
      amount: 10,
    };
    const orderBy = '-id';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.id);

    expect(sorted[0]).toBe('5');
    expect(sorted[1]).toBe('4');
    expect(sorted[2]).toBe('3');
    expect(sorted[3]).toBe('2');
    expect(sorted[4]).toBe('1');
    expect(sorted[5]).toBe('0');
  });
  it('should order number ASC', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-11-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: false,
      user,
      amount: 10,
    };
    const orderBy = 'amount';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.amount);

    expect(sorted[0]).toBe(-10);
    expect(sorted[1]).toBe(3);
    expect(sorted[2]).toBe(10);
    expect(sorted[3]).toBe(20);
    expect(sorted[4]).toBe(80);
    expect(sorted[5]).toBe(100);

    expect(sorted[0]).toBe(-10);
    expect(sorted[1]).toBe(3);
    expect(sorted[2]).toBe(10);
    expect(sorted[3]).toBe(20);
    expect(sorted[4]).toBe(80);
    expect(sorted[5]).toBe(100);
  });
  it('should order number DESC', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-11-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: false,
      user,
      amount: 10,
    };
    const orderBy = '-amount';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.amount);

    expect(sorted[0]).toBe(100);
    expect(sorted[1]).toBe(80);
    expect(sorted[2]).toBe(20);
    expect(sorted[3]).toBe(10);
    expect(sorted[4]).toBe(3);
    expect(sorted[5]).toBe(-10);
  });

  it('should order dates as strings', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-04-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: false,
      user,
      amount: 10,
    };
    const orderBy = '-lastUpdated';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.lastUpdated);

    expect(sorted[0]).toMatch('2020-06-18');
    expect(sorted[1]).toMatch('2020-05-18');
    expect(sorted[2]).toMatch('2020-04-18');
    expect(sorted[3]).toMatch('2020-03-18');
    expect(sorted[4]).toMatch('2020-02-18');
    expect(sorted[5]).toMatch('2020-01-18');
  });

  it('should order dates as strings', () => {
    const item: Task = {
      id: '3',
      name: 'test',
      lastUpdated: '2020-04-18T16:24:35.796Z',
      createdAt: '2020-11-18T16:24:35.796Z',
      done: true,
      user,
      amount: 10,
    };
    const orderBy = '-done';

    const sorted = sortItems<Task>([...items, item], orderBy).map(t => t.name + ' ' + t.done);

    expect(sorted[0]).toMatch('test true');
    expect(sorted[1]).toMatch('d true');
    expect(sorted[2]).toMatch('c true');
    expect(sorted[3]).toMatch('a false');
    expect(sorted[4]).toMatch('b false');
    expect(sorted[5]).toMatch('e false');
  });

  // it.skip('should order arrays', () => {});
});
