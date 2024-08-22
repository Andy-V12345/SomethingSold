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

    console.log("Body: ", event.body)

    const postData = JSON.parse(event.body);

    try {
        const ret = await db('Users').insert(postData, ['id'])

        response.body = JSON.stringify({
            user_id: ret[0]
        });
    }
    catch(error) {
        response.statusCode = '409'
        response.body = JSON.stringify({
            msg: `${error.sqlMessage.endsWith("'Users.email'") ? "EMAIL_TAKEN" : "DUP_ID"}`
        });
    }

    return response;

}