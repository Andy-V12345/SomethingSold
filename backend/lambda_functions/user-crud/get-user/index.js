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
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }

    const user_id = event.pathParameters.id;

    const result = await db("Users").select("*").where('id', user_id)

    if (result.length == 0) {
        response.statusCode = '404'
        response.body = JSON.stringify("USER_NOT_FOUND")
    }
    else {
        response.body = JSON.stringify(result[0])
    }

    return response;
    
}