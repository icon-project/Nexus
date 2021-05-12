import { f2Qp } from '../f2Qp';

it('should return empty string if null/undefined is passed', () => {
  expect(f2Qp()).toEqual('');
  expect(f2Qp(null)).toEqual('');
});

it('should create query params string from payload', () => {
  const payload = [
    {
      attribute: 'username',
      type: '=',
      value: 'wew',
    },
    {
      type: '=',
      value: 'female',
      attribute: 'gender',
    },
    {
      type: '_lte',
      value: '2021-02-08T09:03:41.333Z',
      attribute: 'birthdate',
    },
    {
      type: '_gt',
      value: '2021-02-17T09:03:54.481Z',
      attribute: 'birthdate',
    },
  ];

  const s = f2Qp(payload);
  expect(s).toEqual(
    '?_where%5B0%5D%5Busername%5D=wew&_where%5B1%5D%5Bgender%5D=female&_where%5B2%5D%5Bbirthdate_lte%5D=2021-02-08T09%3A03%3A41.333Z&_where%5B3%5D%5Bbirthdate_gt%5D=2021-02-17T09%3A03%3A54.481Z',
  );
});
