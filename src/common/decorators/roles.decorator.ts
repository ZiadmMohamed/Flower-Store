import { Reflector } from '@nestjs/core';

// Decorator for roles
export const Roles = Reflector.createDecorator<string[]>();
