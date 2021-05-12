import faker from 'faker';

const DATA_SIZE = 300;

/**
 * Generate fake data base on field-type
 *
 * @param { string } key
 * @param { object } fieldType
 * @param { string } fieldType.type
 * @param { string[] } fieldType.enum
 * @param { number } fieldType.maxLength
 * @param { string } fieldType.plugin
 * @param { string } fieldType.model
 * @param { string } fieldType.via
 * @param { string } fieldType.collection
 * @param { boolean } fieldType.isVirtual
 * @param { boolean } fieldType.configurable
 * @param { boolean } fieldType.writable
 * @param { boolean } fieldType.private
 *
 * @returns { undefined | any }
 */
function dummDataFromFieldType(key, fieldType) {
  if (fieldType.via || fieldType.isVirtual || fieldType.configurable || fieldType.private) {
    return;
  }

  let v;

  switch (fieldType.type) {
    case 'string':
      if (key.toLowerCase().includes('name')) {
        v = faker.name.title();
      } else if (fieldType.maxLength && fieldType.maxLength <= 128) {
        v = faker.lorem.words(faker.random.number({ max: 10 }));
      } else {
        v = faker.lorem.sentences(faker.random.number({ max: 5 }));
      }
      break;
    case 'enumeration':
      if (fieldType.enum) {
        v = faker.random.arrayElement(fieldType.enum);
      }
      break;
    case 'datetime':
      v = faker.date.between('1980-01-01', '2015-01-05');
      break;
    // TODO add more cases
  }

  return v;
}

function generateDummy(model) {
  let data = [];
  const keys = Object.keys(model);

  for (let i = 0; i < DATA_SIZE; i++) {
    const dummyData = keys.reduce(
      (a, k) => Object.assign(a, { [k]: dummDataFromFieldType(k, model[k]) }),
      {},
    );

    data.push(dummyData);
  }

  return data;
}

export default generateDummy;
