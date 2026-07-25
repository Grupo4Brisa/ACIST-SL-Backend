import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

import { UserRole } from '../../users/user-role.enum';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean {


    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );


    const request =
      context.switchToHttp()
      .getRequest();


    const user =
      request.user;


    // Não autenticado
    if (!user) {
      return false;
    }


    // =================================
    // ROTAS SEM @Roles()
    // USER ou COMPANY podem acessar
    // =================================
    if (!requiredRoles) {
      return true;
    }



    // =================================
    // EMPRESA
    // Não possui role
    // =================================
    if (user.type === 'COMPANY') {
      return false;
    }



    // =================================
    // COLABORADOR
    // Valida role
    // =================================
    return requiredRoles.includes(
      user.role,
    );

  }

}
