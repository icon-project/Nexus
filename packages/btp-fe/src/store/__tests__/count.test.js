import store from '..';

import count from '../models/count';

store.addModel(count);

/**
 * Test app store
 */

describe('testCountModel', () => {
  describe('reducers', () => {
    test('should dispatch an increment action', () => {
      store.dispatch.count.increment(1);
      expect(store.getState().count).toEqual(1);
    });
    test('should dispatch an decrement action', () => {
      store.dispatch.count.decrement(1);
      expect(store.getState().count).toEqual(0);
    });
  });
  describe('effects', () => {
    test('should be able to trigger incrementAsync action', async () => {
      await store.dispatch.count.incrementAsync(1);
      expect(store.getState().count).toEqual(1);
    });
    test('should be able to trigger decrementAsync action', async () => {
      await store.dispatch.count.decrementAsync(1);
      expect(store.getState().count).toEqual(0);
    });
  });
});
