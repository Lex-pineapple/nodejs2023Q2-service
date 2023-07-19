import { validationErrors } from './errorDb';

export class ValidationError extends Error {
  code: number;
  constructor(code: number) {
    super(validationErrors[code as keyof typeof validationErrors]);
    this.code = code;
  }
}