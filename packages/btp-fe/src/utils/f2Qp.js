/**
 * Convert a filter object to query params
 * @param {Object[]} filters
 * @param {string} filters.attribute
 * @param {string} filters.type
 * @param {*} filters.value
 * @return {string}
 */
export function f2Qp(filters) {
  if (!filters) {
    return '';
  }

  const usp = new URLSearchParams();
  filters.forEach((p, i) => {
    usp.append(`_where[${i}][${p.attribute}${p.type == '=' ? '' : p.type}]`, p.value);
  });

  return `?${usp.toString()}`;
}
