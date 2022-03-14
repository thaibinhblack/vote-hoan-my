export default function TiemKiemfunc() {
  return {
    FindAll(id, items) {
      let i = 0,
        found,
        result = [];

      for (; i < items.length; i++) {
        if (items[i].id === id) {
          result.push(items[i]);
        } else if (_.isArray(items[i].children)) {
          found = this.FindAll(id, items[i].children);
          if (found.length) {
            result = result.concat(found);
          }
        }
      }

      return result;
    }
  };
}
