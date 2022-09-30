function descendingComparator(x, y, orderBy) {
  const as = x[orderBy];
  const bs = y[orderBy];

  var a,
    b,
    a1,
    b1,
    rx = /(\d+)|(\D+)/g,
    rd = /\d/,
    rz = /^0/;
  if (typeof as == 'number' || typeof bs == 'number') {
    if (isNaN(as)) return 1;
    if (isNaN(bs)) return -1;
    return as - bs;
  }
  a = String(as).toLowerCase();
  b = String(bs).toLowerCase();
  if (a === b) return 0;
  if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
  a = a.match(rx);
  b = b.match(rx);
  while (a.length && b.length) {
    a1 = a.shift();
    b1 = b.shift();
    if (a1 !== b1) {
      if (rd.test(a1) && rd.test(b1)) {
        return a1.replace(rz, '.0') - b1.replace(rz, '.0');
      } else return a1 > b1 ? 1 : -1;
    }
  }
  return a.length - b.length;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
