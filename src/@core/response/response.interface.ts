export interface IResponse {
    success: boolean;
    httpStatus: number;
    data: any;
    error: any;
    message: Array<string>;
    miscellaneous: any;
}
