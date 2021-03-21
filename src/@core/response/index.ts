import { IResponse } from './response.interface';

export class Response {
    success: boolean;
    httpStatus: number;
    data: any;
    message: Array<string>;
    miscellaneous: any;

    constructor(success: boolean, data: any) {
        this.success = success;
        this.data = this.success ? data : null;
    }

    setSuccess(success: boolean) {
        this.success = success;
        return this;
    }

    setData(data: any) {
        this.data = data;
        return this;
    }

    setStatus(status: number) {
        this.httpStatus = status;
        return this;
    }

    setMessage(message: Array<string>) {
        this.message = message;
        return this;
    }

    setMiscellaneous(miscellaneous: any) {
        this.miscellaneous = miscellaneous;
        return this;
    }
}
