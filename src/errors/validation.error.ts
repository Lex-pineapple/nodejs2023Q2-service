import errorDb from './errorDb';

export class ValidationError extends Error {
  code: number;
  constructor(code: number) {
    super(errorDb[code as keyof typeof errorDb]);
    this.code = code;
  }
}