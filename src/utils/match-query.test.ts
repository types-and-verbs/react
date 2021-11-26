import { parseISO } from 'date-fns';

import { matchQuery } from './match-query';

const baseQuery = {
  page: 1,
  pageSize: 20,
  where: {},
};

const baseItem = {
  id: '5fb54ac3e9e18915f9e307c8',
  _id: '5fb54ac3e9e18915f9e307c8',
  name: 'testasdf',
  createdAt: '2020-11-18T16:24:35.795Z',
  lastUpdated: '2020-11-18T16:24:35.796Z',
  user: '5ee9e15a2a30366ccdd1ebcc',
};

describe('matchQuery()', () => {
  describe('date helpers', () => {
    it('should handle incorrect _before', () => {
      const query = {
        ...baseQuery,
        where: { schedule_before: '2020-11-18T00:00:00.000Z' },
      };
      const item = {
        ...baseItem,
        schedule: '2020-11-20T16:24:23.511Z',
      };
      expect(matchQuery(query, item)).toBe(false);
    });
    it('should handle _before', () => {
      const query = {
        ...baseQuery,
        where: { schedule_before: '2020-11-18T00:00:00.000Z' },
      };
      const item = {
        ...baseItem,
        schedule: '2020-11-16T16:24:23.511Z',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _after', () => {
      const query = {
        ...baseQuery,
        where: { schedule_after: '2020-11-18T00:00:00.000Z' },
      };
      const item = {
        ...baseItem,
        schedule: '2020-11-20T16:24:23.511Z',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _between', () => {
      const query = {
        ...baseQuery,
        where: { schedule_between: ['2020-11-18T00:00:00.000Z', '2020-11-18T23:59:59.999Z'] },
      };
      const item = {
        ...baseItem,
        schedule: '2020-11-18T16:24:23.511Z',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle a Date', () => {
      const query = {
        ...baseQuery,
        where: { schedule_between: [parseISO('2020-11-18T00:00:00.000Z'), parseISO('2020-11-19T23:59:59.999Z')] },
      };
      const item = {
        ...baseItem,
        schedule: '2020-11-18T16:24:23.511Z',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
  });

  describe('string helpers', () => {
    it('should handle _contains', () => {
      const query = {
        ...baseQuery,
        where: { name_contains: 'clean' },
      };
      const item = {
        ...baseItem,
        name: 'cleaning',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _starts_with', () => {
      const query = {
        ...baseQuery,
        where: { name_starts_with: 'a' },
      };
      const item = {
        ...baseItem,
        name: 'a cleaning',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _ends_with', () => {
      const query = {
        ...baseQuery,
        where: { name_ends_with: 'z' },
      };
      const item = {
        ...baseItem,
        name: 'cleaningz',
      };
      expect(matchQuery(query, item)).toBe(true);
    });
  });

  describe('number helpers', () => {
    it('should handle _lt', () => {
      const query = {
        ...baseQuery,
        where: { amount_lt: 1 },
      };
      const item = {
        ...baseItem,
        amount: 0,
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _lte', () => {
      const query = {
        ...baseQuery,
        where: { amount_lte: 1 },
      };
      const item = {
        ...baseItem,
        amount: 1,
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _gt', () => {
      const query = {
        ...baseQuery,
        where: { amount_gt: 1 },
      };
      const item = {
        ...baseItem,
        amount: 2,
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _gte', () => {
      const query = {
        ...baseQuery,
        where: { amount_gte: 1 },
      };
      const item = {
        ...baseItem,
        amount: 1,
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _between', () => {
      const query = {
        ...baseQuery,
        where: { amount_between: [4, 7] },
      };
      const item = {
        ...baseItem,
        amount: 6,
      };
      expect(matchQuery(query, item)).toBe(true);
    });
  });

  describe('array helpers', () => {
    it('should handle _includes', () => {
      const query = {
        ...baseQuery,
        // TODO SHOULD THIS be a value or an array
        where: { array_includes: 'a' },
      };
      const item = {
        ...baseItem,
        array: ['a', 'c'],
      };
      expect(matchQuery(query, item)).toBe(true);
    });
    it('should handle _excludes', () => {
      const query = {
        ...baseQuery,
        where: { array_excludes: 'b' },
      };
      const item = {
        ...baseItem,
        array: ['a', 'c'],
      };
      expect(matchQuery(query, item)).toBe(true);
    });
  });
});
