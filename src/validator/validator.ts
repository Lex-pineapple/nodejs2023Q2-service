import { TrackValidator } from "./track.validator";
import { UserValidator } from "./user.validator";
import { ValidationError } from "src/errors/validation.error";

class Validator {
  public static user: UserValidator = new UserValidator();
  public static track: TrackValidator = new TrackValidator();

  static validateUUID(id: string): true | ValidationError {
    const uuidRegExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const valid = uuidRegExp.test(id);
    if (!valid) throw new ValidationError(1);
    return valid;
  }

  static validateDtoFields(data: any, schema) {
    return Object.keys(schema)
      .filter((key) => !schema[key](data[key]))
      .map((key) => { throw new ValidationError(3) })
  }
}

export default Validator;