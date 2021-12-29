import { User } from '../user.entity';

export class ResponseFindUsersDto {
    readonly users: User[];
    readonly total: number;
}
