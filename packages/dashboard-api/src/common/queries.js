const { pgPool } = require('.');

async function getDataFromTable(tableName, conditions = {}, options = {}) {
  let { select } = options;
  const { where = {} } = conditions;
  let whereQuery = '';
  select = select ? select.split(' ').join(', ') : '*';
  Object.keys(where).forEach((key, index) => {
    if (!index) {
      return (whereQuery += `${key} ${where[key]}`);
    }
    return (whereQuery += ` AND ${key} ${where[key]}`);
  });

  const queryString = `SELECT ${select} FROM ${tableName} WHERE ${whereQuery}`;
  const result = await pgPool.query(queryString);
  return result.rows;
}

module.exports = {
  getDataFromTable,
};
