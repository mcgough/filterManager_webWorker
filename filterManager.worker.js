import * as Comlink from "comlink";

const RESET_KEY_DEFAULT = "All",
  KEY = "key",
  ASC = "asc",
  DESC = "desc";

class FilterManager {
  constructor({
    items = [],
    filter = "",
    sort = "",
    resetKey = RESET_KEY_DEFAULT,
    key
  }) {
    this._items = [];
    this._filtered = [];
    this._nameCount = null;
    this._key = key;
    this._resetKey = resetKey;
    this._sortState = sort;
    this._filterState = filter;

    this.update(items);
  }

  get items() {
    return this._filtered;
  }

  get filters() {
    return this._nameCount;
  }

  /**
   * update state according to items
   * @param {array} items
   */
  update(items) {
    this._items = items;

    this.mapNameCount();

    if (this._filtered) this.filter(this._filterState);
    if (this._sortState) this.sort(this._sortState);
    else this._filtered = [...items];
  }

  /**
   * filter state manager
   * @param {string} type
   * @param {string} value
   */
  filter(filterType, filter) {
    if (!filterType) return;

    this._filterState = filter;

    switch (filterType) {
      case KEY:
        this.filterByKey(filter);
    }
  }

  filterByKey(key) {
    if (key === this._resetKey) this.reset();
    else this._filtered = this._items.filter(item => item[this._key] === key);
  }

  /**
   * sort state manager
   * @param {string} sortBy
   */
  sort(sortBy) {
    if (!sortBy) return;

    this._sortState = sortBy;

    switch (sortBy) {
      case ASC:
      case DESC:
    }
  }

  /**
   * returns map with item name/count of each drink,
   * sorts map alphabetically by drink name
   */
  mapNameCount() {
    if (!this._key) return;
    this._nameCount = new Map(
      [
        ...this._items.reduce((map, item) => {
          if (!map.has(this._resetKey)) map.set(this._resetKey, 0);
          if (map.has(item[this._key]))
            map.set(item[this._key], map.get(item[this._key]) + 1);
          else map.set(item[this._key], 1);

          map.set(this._resetKey, map.get(this._resetKey) + 1);

          return map;
        }, new Map())
      ].sort((a, b) => (a[0] > b[0] && 1) || (b[0] > a[0] && -1) || 0)
    );
  }

  reset() {
    this._filtered = [...this._items];
    this._filterState = "";
    this._sortState = "";
  }
}

Comlink.expose(FilterManager);
