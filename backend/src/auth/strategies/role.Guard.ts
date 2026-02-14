import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

export class roleGuard implements CanActivate {

  constructor(private readonly role: string) {
    this.role = role;
  }

  canActivate(
    context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role === this.role) {
      return true;
    }
    throw new ForbiddenException('role not defined');
  }
}