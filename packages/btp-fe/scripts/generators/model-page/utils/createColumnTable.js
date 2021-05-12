const titleCase = require('../../utils/titleCase');

module.exports = function createColumnTable(model = {}) {
  const attr = model.attributes;

  if (attr) {
    const attrKeys = Object.keys(attr) || [];
    return attrKeys.map((c) => ({
      title: `##t('${model.collectionName}.${c}', '${titleCase(c)}')##`,
      dataIndex: c,
      key: c,
    }));
  }
  throw new Error(`Cannot get model's attributes`);
};

// {
//   title: t('user.preferred_name', 'Preferred name'),
//   dataIndex: 'pName',
// },
