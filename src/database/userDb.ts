import { IFilterOptions, User } from 'types/types';

class UserDb {
  db: User[];
  constructor() {
    this.db = [];
  }

  findUnique(filterOprions: IFilterOptions) {
    const [key, value] = Object.entries(filterOprions.where)[0];
    const foundRecord = this.db.find((record) => {
      record[key as keyof User] === value;
    });
    return foundRecord;
  }

  findMany(filterOprions?: IFilterOptions) {
    if (filterOprions) {
      let filteredArr: User[] = [];
      const filterFields = { ...filterOprions.where };
      for (const [key, value] of Object.entries(filterFields)) {
        const entries = this.db.filter((record) => {
          record[key as keyof User] === value;
        });
        filteredArr = [...filteredArr, ...entries];
      }
      return filteredArr;
    }
    return this.db;
  }
}

export default UserDb;
