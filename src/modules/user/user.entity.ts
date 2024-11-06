import { Role } from "src/common/enum/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 200, unique: true, nullable: false})
    username: string

    @Column({ type: "varchar", length: 200, unique: true, nullable: false})
    email: string

    @Column()
    password: string

    @Column({
        type: "enum",
        enum: Role,
        array: true,
        default: [Role.User]
    })
    roles: Role[]
}