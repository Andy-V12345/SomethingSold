import knex from 'knex';
import {configDotenv} from 'dotenv'

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
    const response = {
        statusCode: '200',
        body: null,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }

    const postData = JSON.parse(event.body);
    const user_id = event.pathParameters.id;

    try {
        await db('Users').where({id : user_id}).update(postData)
        response.body = JSON.stringify({
            msg: "USER_UPDATED"
        })

    }
    catch(err) {
        response.statusCode = '409'
        response.body = JSON.stringify({
            msg: "EMAIL_TAKEN"
        })
    }

    return response
}