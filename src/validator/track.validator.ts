export class TrackValidator {
  schema = {
    name: (value: any) => typeof value === 'string',
    artistId: (value: any) => typeof value === 'string' || typeof value === null,
    albumId: (value: any) => typeof value === 'string' || typeof value === null,
    duratiuon: (value: any) => typeof value === 'number',
  }
}