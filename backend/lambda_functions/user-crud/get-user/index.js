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
        status: 200,
        body: null,
    }

    const result = await db("Users").select("*").where('id', event.id)

    if (result.length == 0) {
        response.status = 404
        response.body = "USER_NOT_FOUND"
    }
    else {
        response.body = result[0]
    }

    return response;
    
}