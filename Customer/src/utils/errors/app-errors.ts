
const STATUS_CODES={
    OK:200,
    BAD_REQUEST:400,
    UN_AUTHORISED:403,
    NOT_FOUND:404,
    INTERNAL_SERVER_ERROR:500
}

class BaseError extends Error {
statusCode: number;
constructor(
    name: string,
    statusCode: number,
    description: string,
   
){
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this)

}
}

export class APIError extends BaseError{
constructor(description="API ERROR"){
    super("API Internal Server Error", STATUS_CODES.INTERNAL_SERVER_ERROR,description)
}
}

export class ValidationError extends BaseError{
    constructor(description="Bad Request"){
        super("Bad Request", STATUS_CODES.BAD_REQUEST,description)
    }
    }

export class  NotFoundError extends BaseError{
        constructor(description="Not Found"){
            super("Not Found", STATUS_CODES.NOT_FOUND,description)
 }
}

export class UnAuthorisedError extends BaseError{
    constructor(description="Access Denied"){
        super("Access Denied", STATUS_CODES.UN_AUTHORISED,description)
}
}

