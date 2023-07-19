export class ArtistValidator {
  schema = {
    name: (value: any) => typeof value === 'string',
    grammy: (value: any) => typeof value === 'boolean',
  };
}
