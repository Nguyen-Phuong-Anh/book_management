import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnToBook1730281558883 implements MigrationInterface {
    name = 'AddColumnToBook1730281558883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('book', new TableColumn({
            name: 'numberOfCopy',
            type: 'int',
            isNullable: false,
            default: '100'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('book', 'numberOfCopy')
    }

}
