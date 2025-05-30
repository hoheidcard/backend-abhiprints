import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '../../account/entities/account.entity';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): Account => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
