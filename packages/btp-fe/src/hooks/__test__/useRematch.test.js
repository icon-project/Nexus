import { useDispatch, useSelect } from '../useRematch';
import { useDispatch as spyUseDispatch, useStore, useSelector } from 'react-redux';

jest.mock('react-redux');

/**
 * Test app store
 */

describe('useRematch hooks', () => {
  describe('useDispatch', () => {
    it('should call useDispatch from package react-redux', () => {
      const selector = jest.fn();

      // actual calling
      useDispatch(selector);

      expect(spyUseDispatch).toBeCalled();
    });
    it('should return value from useDispatch', () => {
      const rs = {};

      spyUseDispatch.mockReturnValue(rs);

      const selector = jest.fn();

      // actual calling
      useDispatch(selector);

      expect(selector).toBeCalledWith(rs);
    });
  });
  describe('useSelect', () => {
    beforeEach(() => {
      const select = jest.fn();
      const rs = { select };

      useStore.mockReturnValue(rs);

      const selector = jest.fn();

      // actual calling
      useSelect(selector);
    });

    it('should call useStore from package react-redux', () => {
      expect(useStore).toBeCalled();
    });

    it('should call useSelector from package react-redux', () => {
      // const select = jest.fn();
      // const selector = jest.fn();

      expect(useSelector).toBeCalled();
    });
  });
});
