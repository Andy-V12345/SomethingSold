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
        statusCode: '200',
        body: null,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    };

    const postData = JSON.parse(event.body);

    try {
        await db('Users').insert({
            email: postData.email,
            phone_number: postData.phone_number,
            location: postData.location,
            move_in_date: postData.move_in_date,
            move_out_date: postData.move_out_date,
            first_name: postData.first_name,
            last_name: postData.last_name,
        })

        response.body = "USER_CREATED";
    }
    catch(error) {
        response.statusCode = '409'
        response.body = "EMAIL_TAKEN";
    }

    return response;

}