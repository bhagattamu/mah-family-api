export interface IResponse {
    success: boolean;
    httpStatus: number;
    data: any;
    message: Array<string>;
    miscellaneous: any;
}
