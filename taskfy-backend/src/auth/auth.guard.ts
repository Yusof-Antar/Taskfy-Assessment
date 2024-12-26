import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyToken } from './jwt/jwt.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const decoded = verifyToken(token);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
