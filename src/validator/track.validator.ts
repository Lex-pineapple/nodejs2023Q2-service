export class TrackValidator {
  schema = {
    name: (value: any) => typeof value === 'string',
    artistId: (value: any) => typeof value === 'string',
    albumId: (value: any) => typeof value === 'string',
    duratiuon: (value: any) => typeof value === 'number',
  }
}