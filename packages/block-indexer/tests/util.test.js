'use strict';

const { hexToFixedAmount } = require('../src/common/util');

test('should convert asset value from hex string to fixed number', () => {
  const value = hexToFixedAmount('0x212b431ec0000');

  expect(value).toBe(0.000584);
});
