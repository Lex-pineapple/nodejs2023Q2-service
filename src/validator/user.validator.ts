export class UserValidator {
  schemaCreate = {
    login: (value: any) => typeof value === 'string',
    password: (value: any) => typeof value === 'string',
  }

  schemaUpdate = {
    oldPassword: (value: any) => typeof value === 'string',
    newPassword: (value: any) => typeof value === 'string',
  }
}