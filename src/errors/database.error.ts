import errorDb from './errorDb';

class DatabaseError extends Error {
  code: number;
  constructor(code: number) {
    super(errorDb[code as keyof typeof errorDb]);
    this.code = code;
  }
}

export default DatabaseError;