import store from 'store';
import { addStoreModel } from '../addStoreModel';

jest.mock('store');

it('should call store.addModel and pass model to it', () => {
  const model = {};
  addStoreModel(model);
  expect(store.addModel).toBeCalledWith(model);
});
