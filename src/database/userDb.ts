import DatabaseError from 'src/errors/database.error';
import {
  CreateUserDto,
  IFilterOptions,
  UpdatePasswordDto,
  User,
} from 'types/types';
import { v4 as uuidv4 } from 'uuid';

export class UserDb {
  db: User[];
  constructor() {
    this.db = [];
  }

  findUnique(filterOprions: IFilterOptions) {
    const filterFields = Object.entries(filterOprions.where);
    const foundRecord = this.db.find((record) => {
      const retval = filterFields.reduce((acc, curr) => {
        const [key, value] = curr;
        return record[key] === value ? acc + 1 : acc;
      }, 0);
      return retval === filterFields.length ? 1 : 0;
    });
    if (!foundRecord) throw new DatabaseError(2);
    return foundRecord;
  }

  findMany(filterOprions?: IFilterOptions) {
    if (filterOprions) {
      const filterFields = Object.entries(filterOprions.where);
      return this.db.filter((record) => {
        const retval = filterFields.reduce((acc, curr) => {
          const [key, value] = curr;
          return record[key] === value ? acc + 1 : acc;
        }, 0);
        return retval === filterFields.length ? 1 : 0;
      });
    }
    return this.db;
  }

  create(data: CreateUserDto) {
    const newCommer = {
      id: uuidv4(),
      login: data.login,
      password: data.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.db.push(newCommer);
    const { password: _, ...rest } = newCommer;
    return rest;
  }

  update(id: string, data: UpdatePasswordDto) {
    const user = this.findUnique({
      where: {
        id: id,
      },
    });
    if (user.password !== data.oldPassword) throw new DatabaseError(101);
    user.password = data.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    const { password: _, ...rest } = user;
    return rest;
  }

  delete(id: string) {
    const user = this.findUnique({
      where: {
        id: id,
      },
    });
    const recordIdx = this.db.indexOf(user);
    if (recordIdx > -1) {
      this.db.splice(recordIdx, 1);
    }
  }
}
