import { databaseErrors } from './errorDb';

class DatabaseError extends Error {
  code: number;
  constructor(code: number) {
    super(databaseErrors[code as keyof typeof databaseErrors]);
    this.code = code;
  }
}

export default DatabaseError;
