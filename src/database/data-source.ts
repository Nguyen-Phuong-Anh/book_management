
import { Category } from "../modules/category/category.entity";
import { Book } from "../modules/book/book.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "superpower",
    database: "new",
    synchronize: true,
    entities: [Book, Category],
    migrations: ["./src/database/migrations/*.ts"],
})