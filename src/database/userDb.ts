import DatabaseError from 'src/database/errorDb';
import Validator from 'src/validator/validator';
import { CreateUserDto, IFilterOptions, UpdatePasswordDto, User } from 'types/types';
import { v4 as uuidv4 } from 'uuid';

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

  create(data: CreateUserDto) {
    const newCommer = {
      id: uuidv4(),
      login: data.login,
      password: data.password,
      version: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    this.db.push(newCommer);
    return newCommer;
  }

  update(id: string, data: UpdatePasswordDto) {
    const user = this.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new DatabaseError(2);
    if (user.password !== data.oldPassword) throw new DatabaseError(101);
    user.password = data.newPassword;
    return user;
  }

  delete(id: string) {
    const user = this.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new DatabaseError(2);
    const recordIdx = this.db.indexOf(user);
    if (recordIdx > -1) {
      this.db.splice(recordIdx, 1);
    }
  }
}

export default UserDb;
