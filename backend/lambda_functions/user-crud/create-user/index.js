import Knex from 'knex';
import {configDotenv} from 'dotenv'

configDotenv()

const db = Knex({
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
        statusCode: 200,
        body: null,
    };

    try {
        await db('Users').insert({
            email: event.email,
            phone_number: event.phone_number,
            location: event.location,
            move_in_date: event.move_in_date,
            move_out_date: event.move_out_date,
            first_name: event.first_name,
            last_name: event.last_name,
        })

        response.body = "USER_CREATED";
    }
    catch(error) {
        response.statusCode = 409
        response.body = "EMAIL_TAKEN";
    }

    return response;

}