export class AlbumValidator {
  schema = {
    name: (value: any) => typeof value === 'string',
    year: (value: any) => typeof value === 'number',
    artistId: (value: any) => typeof value === 'number' || typeof value === null,
  }
}