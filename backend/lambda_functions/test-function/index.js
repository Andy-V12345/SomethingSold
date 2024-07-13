import knex from 'knex'

const db = knex({
    client: 'mysql',
    connection: {
        host: "somethingsold-db.cr6o0assuiva.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "somethingsold123",
        port: "3306",
        database: "somethingsold"
    }
})

export const handler = async (event) => {
    const response = {
        statusCode: 200,
        body: null,
    };

    const res = await db('Users').select();

    response.body = JSON.stringify(res);

    return response;    
};