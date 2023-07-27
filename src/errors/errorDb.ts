const validationErrors = {
  1: 'UUID is invalid',
  3: 'Body does not contain required fields',
};

const databaseErrors = {
  2: 'Record with this ID doies not exist',
  101: 'oldPassowrd is wrong',
  401: 'The item is not in favorites',
};

export { validationErrors, databaseErrors };
