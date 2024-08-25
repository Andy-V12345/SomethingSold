import knex from "knex";
import { configDotenv } from "dotenv";

configDotenv()

const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.SERVER_HOST,
        user: process.env.SERVER_USER,
        password: process.env.SERVER_PASSWORD,
        port: "3306",
        database: "somethingsold"
    },
    useNullAsDefault: true
})

export const handler = async (event) => {
    let response = {
        statusCode: '200',
        body: null,
    }

    const user_id = event.pathParameters.id;

    await db('Users').where('id', user_id).delete();

    response.body = "USER_DELETED"

    return response;
}