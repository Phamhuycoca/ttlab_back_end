// is-valid-date.constraint.ts
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const inputDate = new Date(value);
    const currentDate = new Date();

    if (isNaN(inputDate.getTime())) {
      return false; // Invalid date format
    }

    return inputDate <= currentDate;
  }

  defaultMessage(args: ValidationArguments) {
    return `Ngày sinh không được quá ngày hiện tại và phải ở định dạng (YYYY-MM-DD)`;
  }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateConstraint,
    });
  };
}
