# Home Library Service

## Installing and testing the application

1. Clone repository
2. Run `npm install`
3. For linting run `npm run lint`
4. Create **.env** file based on .env.example
5. To start the docker container: `npm run docker:build:up`
6. To test authorization run: `npm run test:auth`

PORT value is stored in .env file (should be created based on .env.example file).

You can view OpenAPI documentation on http://localhost:4000/doc/.

#### The API has following endpoints:

- `/user`
  - **GET** /user - get all users
  - **GET** /user/:id - get single user by id
  - **POST** /user - create user
  - **PUT** /user/:id - update user's password
  - **DELETE** /user/:id - delete user
- `/track`
  - **GET** /track - get all tracks
  - **GET** /track/:id - get single track by id
  - **POST** /track - create new track
  - **PUT** /track/:id - update track info
  - **DELETE** /track/:id - delete track
- `/artist`
  - **GET** /artist - get all artists
  - **GET** /artist/:id - get single artist by id
  - **POST** /artist - create new artist
  - **PUT** /artist/:id - update artist info
  - **DELETE** /artist/:id - delete album
- `/album`
  - **GET** /album - get all albums
  - **GET** /album/:id - get single album by id
  - **POST** /album - create new album
  - **PUT** /album/:id - update album info
  - **DELETE** /album/:id - delete album
- `/favs`
  - **GET** /favs - get all favorites
  - **POST** /favs/track/:id - add track to the favorites
  - **DELETE** /favs/track/:id - delete track from favorites
  - **POST** /favs/album/:id - add album to the favorites
  - **DELETE** /favs/album/:id - delete album from favorites
  - **POST** /favs/artist/:id - add artist to the favorites
  - **DELETE** /favs/artist/:id - delete artist from favorites
- `Signup` (`auth/signup` route)
  - **POST** auth/signup - send `login` and `password` to create a new `user`
- `Login` (`auth/login` route)
  - **POST** auth/login - send `login` and `password` to get Access token and Refresh token (optionally)
- `Refresh` (`auth/refresh` route)
  - **POST** auth/refresh - send refresh token in body as `{ refreshToken }` to get new pair of Access token and Refresh token
