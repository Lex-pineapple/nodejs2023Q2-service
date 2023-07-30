import { ArtistValidator } from 'src/validator/artist.validator';
import { TrackValidator } from './track.validator';
import { UserValidator } from './user.validator';
import { ValidationError } from 'src/errors/validation.error';
import { AlbumValidator } from 'src/validator/album.validator';

class Validator {
  public static user: UserValidator = new UserValidator();
  public static track: TrackValidator = new TrackValidator();
  public static artist: ArtistValidator = new ArtistValidator();
  public static album: AlbumValidator = new AlbumValidator();

  static validateUUID(id: string, path?: string): true | ValidationError {
    const uuidRegExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const valid = uuidRegExp.test(id);
    if (!valid) throw new ValidationError(1, path);
    return valid;
  }

  static validateDtoFields(data: any, schema) {
    return Object.keys(schema.fields)
      .filter((key) => {
        return !schema.fields[key](data[key]);
      })
      .map((key) => {
        if (schema.required.includes(key)) throw new ValidationError(3);
      });
  }

  static validatePassword(oldPassowrd: string, passwordFromDto: string) {
    if (oldPassowrd !== passwordFromDto) throw new ValidationError(101);
  }
}

export default Validator;
