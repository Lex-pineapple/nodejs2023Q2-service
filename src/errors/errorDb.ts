const validationErrors = {
  1: 'UUID is invalid',
  3: 'Body does not contain required fields',
  101: 'oldPassowrd is wrong',
  401: 'Login already exists',
  402: 'Incorrect login or password',
};

const databaseErrors = {
  2: 'Record with this ID doies not exist',
  201: 'User not found',
  202: 'Track not found',
  203: 'Artist not found',
  204: 'Album not found',
  401: 'The item is not in favorites',
};

const prismaErrors = {
  user: {
    P2025: databaseErrors[201],
  },
  artist: {
    P2025: databaseErrors[203],
  },
  album: {
    P2025: databaseErrors[204],
  },
  track: {
    P2025: databaseErrors[202],
  },
};

export { validationErrors, databaseErrors, prismaErrors };
