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
        status: 200,
        body: null,
    }

    try {
        await db('Users').where({id : event.id}).update(event.userData)
        response.body = "USER_UPDATED"
    }
    catch(err) {
        response.status = 409
        response.body = "EMAIL_TAKEN"
    }

    return response
}