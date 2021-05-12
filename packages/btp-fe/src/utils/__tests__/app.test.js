/**
 * Test utility functions
 */

import { media } from '../../components/Styles/Media';
import {
  filterObjectByKeyArr,
  getAttributesForForm,
  getDataByAttrName,
  handleRenderInput,
} from '../app';
import { Input } from 'antd';

describe('testUtilityFunctions', () => {
  const filtersData = [
    // use for FilterBox component
    {
      attribute: 'name',
      type: 'string',
      values: [],
      filterTypes: [
        { label: 'equal', value: '=' },
        { label: 'not equal', value: '_ne' },
        { label: 'is less than', value: '_lt' },
        { label: 'is less than or equal to', value: '_lte' },
        { label: 'is greater than', value: '_gt' },
        { label: 'is greater than or equal to', value: '_gte' },
        { label: 'contains', value: '_contains' },
        { label: 'contains (case sensitive)', value: '_containss' },
      ],
    },
    {
      attribute: 'status',
      type: 'enumeration',
      values: ['requesting', 'accepted', 'banned'],
      filterTypes: [
        { label: 'equal', value: '=' },
        { label: 'not equal', value: '_ne' },
      ],
    },
  ];
  describe('action', () => {
    test('adds 1 + 2 to equal 3', () => {
      function sum(a, b) {
        return a + b;
      }
      expect(sum(1, 2)).toBe(3);
    });
  });
  describe('testMediaFunction', () => {
    test('should return array of media with a breakpoint and styles for it', () => {
      const md = media.md`color: red;`;
      const expectedOutput = ['@media (min-width:', '768', 'px){', 'color: red;', ';}'];
      expect(md).toEqual(expectedOutput);
    });
  });
  describe('testFilterObjectByKeyArrFunction', () => {
    test('should return an object matching keys of an array', () => {
      const objItem = {
        id: { type: 'string' },
        confirmed: { type: 'enumeration', enum: [0, 1] },
        username: { type: 'string' },
        pName: { type: 'string' },
        email: { type: 'string' },
        gender: { type: 'enumeration', enum: ['male', 'female', 'unset'] },
        birthdate: { type: 'timestamp' },
      };
      const keyArr = ['username', 'birthdate', 'email'];
      const expectedOutput = {
        username: { type: 'string' },
        birthdate: { type: 'timestamp' },
        email: { type: 'string' },
      };
      const result = filterObjectByKeyArr(objItem, keyArr);
      expect(result).toEqual(expectedOutput);
    });
  });
  describe('testGetAttributesForForm', () => {
    test('should return an object with attributes which is suitable to show on the form', () => {
      const objItem = {
        name: { type: 'string', maxLength: 128 },
        status: { type: 'enumeration', enum: ['requesting', 'accepted', 'banned'] },
        users_permissions_user: { plugin: 'users-permissions', model: 'user', via: 'friends' },
        users: { plugin: 'users-permissions', collection: 'user', via: 'friend', isVirtual: true },
        published_at: { type: 'datetime', configurable: false },
        created_by: {
          model: 'user',
          plugin: 'admin',
          configurable: false,
          writable: false,
          private: true,
        },
        updated_by: {
          model: 'user',
          plugin: 'admin',
          configurable: false,
          writable: false,
          private: true,
        },
      };
      const expectedOutput = {
        name: { type: 'string', maxLength: 128 },
        status: { type: 'enumeration', enum: ['requesting', 'accepted', 'banned'] },
      };
      const result = getAttributesForForm(objItem);
      expect(result).toEqual(expectedOutput);
    });
    describe('testGetDataByAttrName', () => {
      test('should return an object matching with an attribute name', () => {
        const value = 'name';
        const expectedOutput = {
          attribute: 'name',
          type: 'string',
          values: [],
          filterTypes: [
            { label: 'equal', value: '=' },
            { label: 'not equal', value: '_ne' },
            { label: 'is less than', value: '_lt' },
            { label: 'is less than or equal to', value: '_lte' },
            { label: 'is greater than', value: '_gt' },
            { label: 'is greater than or equal to', value: '_gte' },
            { label: 'contains', value: '_contains' },
            { label: 'contains (case sensitive)', value: '_containss' },
          ],
        };
        const result = getDataByAttrName(value, filtersData);
        expect(result).toEqual(expectedOutput);
      });
    });
    describe('testHandleRenderInput', () => {
      test('should return an Input Element which is subtable with type of attribute', () => {
        const value = 'name';
        const expectedOutput = <Input />;
        const result = handleRenderInput(value, filtersData);
        expect(result).toEqual(expectedOutput);
      });
    });
  });
});
