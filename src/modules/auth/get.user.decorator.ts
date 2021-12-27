import { createParamDecorator } from '@nestjs/common';

import { User } from '../user/user.entity';

export const GetUser = createParamDecorator((_, req): User => req.args[0].user);
