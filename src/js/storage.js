// storage.js
class StorageInterface {
  saveData(key, data) {}
  getData(key) {}
  removeData(key) {}
}

class LocalStorage extends StorageInterface {
  saveData(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
  }

  getData(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
  }

  removeData(key) {
      localStorage.removeItem(key);
  }
}

export { StorageInterface, LocalStorage };