export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
}

export interface UpdateUserStatusDto {
    status: 'active' | 'inactive';
}