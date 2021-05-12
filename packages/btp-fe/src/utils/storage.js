const set = (key, value) => {
  if (!key) return;
  sessionStorage.setItem(key, JSON.stringify(value));
};

const get = (key) => {
  if (!key) return;
  var item = sessionStorage.getItem(key);

  if (!item) {
    return;
  }

  if (item === 'undefined') return null;

  return JSON.parse(item);
};

const remove = (key) => {
  if (!key) return;
  sessionStorage.removeItem(key);
};

const clear = () => {
  sessionStorage.clear();
};

const storage = {
  get,
  set,
  remove,
  clear,
};

export default storage;
