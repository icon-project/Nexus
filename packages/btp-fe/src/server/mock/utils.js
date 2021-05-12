import qs from 'qs';
export class ResponsePaging {
  constructor(data, page = 0, size = 1000) {
    const i = page * size;
    const l = data.length;
    this.results = data.slice(i, i + size);
    this.pagination = { page, pageSize: size, pageCount: Math.floor(l / size), total: l };
  }
}

export function applyFilter(data, url) {
  const { _where } = qs.parse(url.substr(url.indexOf('?') + 1));
  const results = data.filter((d) => {
    let flag = true;

    for (const obj of _where) {
      const k = Object.keys(obj)[0];
      const v = obj[k];
      const lastIndexOf_ = k.lastIndexOf('_');

      if (lastIndexOf_ == -1) {
        flag &= d[k] == v;
      } else {
        const comparingOperator = k.substr(lastIndexOf_);
        const attribute = k.substring(0, lastIndexOf_);
        switch (comparingOperator) {
          case '_ne':
            flag &= d[attribute] != v;
            break;
          case '_lt':
            flag &= d[attribute] < v;
            break;
          case '_lte':
            flag &= d[attribute] <= v;
            break;
          case '_gt':
            flag &= d[attribute] > v;
            break;
          case '_gte':
            flag &= d[attribute] >= v;
            break;
          case '_contains':
            flag &= d[attribute].toLowerCase().includes(v.toLowerCase());
            break;
          case '_containss':
            flag &= d[attribute].includes(v);
            break;
        }
      }
    }
    return flag;
  });
  return results;
}
