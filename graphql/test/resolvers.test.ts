import { filterCheck } from '../lib/resolvers';
import { Filter } from '../lib/resolvers-types';

test('Filters game list to return only those games I own', () => {
  expect(filterCheck(Filter.Own).length).toBe(563);
});