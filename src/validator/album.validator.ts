export class AlbumValidator {
  schema = {
    fields: {
      name: (value: any) => typeof value === 'string',
      year: (value: any) => typeof value === 'number',
      artistId: (value: any) => typeof value === 'number',
    },
    required: ['name', 'year'],
  };
}
