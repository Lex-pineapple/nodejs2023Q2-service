import DatabaseError from "src/database/errorDb";

class Validator {
    validateUUID(id: string): true | DatabaseError {
        const uuidRegExp =
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        const valid = uuidRegExp.test(id);
        if (!valid) throw new DatabaseError(1);
        return valid;
    }

    validateUserCreate(data: any): boolean {
        if (data instanceof Object) {
            if (!('login' in data && typeof data.login === 'string')) throw new DatabaseError(3);
            if (!('password' in data && typeof data.password === 'string')) throw new DatabaseError(3);
            return true;
        } else throw new DatabaseError(3);
    }

    validateUserUpdate(data: any): boolean {
        if (data instanceof Object) {
            if (!('oldPassword' in data && typeof data.oldPassword === 'string')) throw new DatabaseError(3);
            if (!('newPassword' in data && typeof data.newPassword === 'string')) throw new DatabaseError(3);
            return true;
        } else throw new DatabaseError(3);
    }
}

export default Validator;