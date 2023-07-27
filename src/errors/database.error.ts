import { databaseErrors } from './errorDb';

class DatabaseError extends Error {
  code: number;
  path: string;
  constructor(code: number, path?: string) {
    super(databaseErrors[code as keyof typeof databaseErrors]);
    this.code = code;
    this.path = path;
  }
}

export default DatabaseError;
