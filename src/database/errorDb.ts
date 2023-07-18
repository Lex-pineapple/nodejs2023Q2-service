const errors = {
    1: 'UUID is invalid',
    2: 'Record with this ID doies not exist',
    3: 'Body does not contain required fields',
    101: 'Old password is incorrect',
}

class DatabaseError {
    code: number;
    message: string;
    constructor(errorCode: number) {
        this.code = errorCode;
        this.message = errors[errorCode as keyof typeof errors]
    }
}

export default DatabaseError;