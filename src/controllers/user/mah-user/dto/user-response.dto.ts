import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {
            id: '600319f2af81bc2cbc0180f8',
            firstName: 'Bhagat',
            lastName: 'Gurung',
            email: 'bhagattamu@gmail.com',
            phone: '9819123480',
            roles: ['user']
        },
        description: 'Data returned from Create User'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '201',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['USER_REGISTERED'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}

export class LoginResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {
            id: '600319f2af81bc2cbc0180f8',
            firstName: 'Bhagat',
            lastName: 'Gurung',
            email: 'bhagattamu@gmail.com',
            phone: '9819123480',
            roles: ['user'],
            accessToken:
                '756c3a0328531d49e01f0071595ffb9875d13cc21803a911ea85dcd69b5dec58f5ad125a4dcfad352d1e9a8146c16ecca38b93fa637f80c56cc87f64315c9a33390c291003fdf7c8f4eab22171961c13adf54c53e7e07a1a44fb9cf5cb56de5f105cc5ea05b8a68f71ae21f63a84010b18516525bb96e6fb611a47cfd3c433679f1dfaf149b1fdac32f5fe0fa22be183ea25750e152d69f241dfc4f3d8ec4933b58e8c3413fe3c4267b4b95d31b54a91fee65959c680adea9e97204cad0d450918ba6e56511d0b29ccd45a4685fd1b59abfad6a0b9247e97ff104fdad63848e3776412a752cf0f1d17ef5c849b1844d70ba395f0a01fccff37b75ff3a3469989bbc1bd1d01b24032a8f99af7d2224b56'
        },
        description: 'Data returned from Login'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '200',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['LOGGED_IN'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}

export class VerifyUserResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {
            id: '600319f2af81bc2cbc0180f8',
            firstName: 'Bhagat',
            lastName: 'Gurung',
            email: 'bhagattamu@gmail.com',
            phone: '9819123480',
            roles: ['user']
        },
        description: 'Data returned from Verify User'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '200',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['VERIFIED'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}

export class RefreshTokenResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {
            accessToken: 'asfasfjkalsf.asfoahsofjnasf.asfasf'
        },
        description: 'Data returned from Refresh-token'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '200',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['REFRESHED_TOKEN'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}

export class LogoutResponse {
    @ApiProperty({
        example: true,
        description: 'Success'
    })
    readonly success: boolean;

    @ApiProperty({
        example: {},
        description: 'Data returned from Logout User'
    })
    readonly data: any;

    @ApiProperty({
        example: null,
        description: 'Error object when error is encountered'
    })
    readonly error: any;

    @ApiProperty({
        example: '200',
        description: 'Http Status'
    })
    readonly httpStatus: number;

    @ApiProperty({
        example: ['LOGGED_OUT'],
        description: 'Message'
    })
    readonly message: Array<string>;

    @ApiProperty({
        example: [],
        description: 'Miscellaneous data'
    })
    readonly miscellaneous: any;
}
