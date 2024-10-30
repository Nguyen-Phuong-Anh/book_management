import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IsUniqueConstraintInput } from "../type/is-unique-input";
import { EntityManager } from "typeorm";

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true})
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor( private readonly entityManager: EntityManager ) {}
    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const { tableName, column }: IsUniqueConstraintInput = args.constraints[0]
        
        const exist = await this.entityManager
            .getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({ [column]: value })
            .getOne()

        return exist ? false : true;
    }
    defaultMessage?(args?: ValidationArguments): string {
        return 'Username or Email already exists'
    }

}