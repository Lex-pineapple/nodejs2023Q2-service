import { IFilterOptions, Track } from 'types/types';

export class TrackDb {
  db: Track[];
  constructor() {
    this.db = [];
  }

  findMany(filterOprions?: IFilterOptions) {
    if (filterOprions) {
      let filteredArr: Track[] = [];
      const filterFields = { ...filterOprions.where };
      for (const [key, value] of Object.entries(filterFields)) {
        const entries = this.db.filter((record) => {
          record[key as keyof Track] === value;
        });
        filteredArr = [...filteredArr, ...entries];
      }
      return filteredArr;
    }
    return this.db;
  }
}
