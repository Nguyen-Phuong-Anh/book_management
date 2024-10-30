import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { IsUniqueConstraintInput } from 'src/shared/type/is-unique-input';
import { IsUniqueConstraint } from 'src/shared/validation/is-unique-constraint.validation';

export function IsUnique(
    property: IsUniqueConstraintInput, 
    validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
}