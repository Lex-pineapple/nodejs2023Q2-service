export class UserValidator {
  schemaCreate = {
    fields: {
      login: (value: any) => typeof value === 'string',
      password: (value: any) => typeof value === 'string',
    },
    required: ['login', 'password'],
  };

  schemaUpdate = {
    fields: {
      oldPassword: (value: any) => typeof value === 'string',
      newPassword: (value: any) => typeof value === 'string',
    },
    required: ['oldPassword', 'newPassword'],
  };
}
