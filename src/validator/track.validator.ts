export class TrackValidator {
  schema = {
    fields: {
      name: (value: any) => typeof value === 'string',
      artistId: (value: any) => typeof value === 'string',
      albumId: (value: any) => typeof value === 'string',
      duration: (value: any) => typeof value === 'number',
    },
    required: ['name', 'duration'],
  };
}
