import faker from 'faker';
import { ResponsePaging, applyFilter } from 'server/mock/utils';

const DATA_SIZE = 300;

function generateData() {
  let data = [];

  for (let i = 0; i < DATA_SIZE; i++) {
    data.push({
      id: i + 1,
      address: faker.address.streetAddress(),
      agreement: true,
      birthdate: faker.date.between('1980-01-01', '2015-01-05'),
      email: faker.internet.email(),
      familyName: faker.name.lastName(),
      gender: faker.random.number({
        min: 1,
        max: 3,
      }),
      givenName: faker.name.firstName(),
      locale: 'en',
      middleName: faker.name.middleName(),
      pName: faker.name.firstName(),
      phoneNumber: faker.phone.phoneNumber(),
      picture: faker.internet.avatar(),
      state: 'enable',
      username: faker.internet.userName(),
    });
  }

  return data;
}

const data = generateData();

export default function (m) {
  m.onGet('/users').reply(200, new ResponsePaging(data));
  m.onGet(/\/users\?.*/).reply((config) => {
    const results = applyFilter(data, config.url);

    return [200, new ResponsePaging(results)];
  });
}
