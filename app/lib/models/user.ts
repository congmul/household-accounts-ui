export type User = {
    _id: string;
    email: string
    firstName: string
    lastName: string
    fullname: string
    joinThrough: string
    lastLogin: string
    updateAt: string
}

export type LoginResponse = {
    userInfo: User;
    accessToken: string;
}

export type LoginPayload = {
    email: string;
    password: string;
}