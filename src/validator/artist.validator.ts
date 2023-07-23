export class ArtistValidator {
  schema = {
    fields: {
      name: (value: any) => typeof value === 'string',
      grammy: (value: any) => typeof value === 'boolean',
    },
    required: ['name', 'grammy'],
  };
}
