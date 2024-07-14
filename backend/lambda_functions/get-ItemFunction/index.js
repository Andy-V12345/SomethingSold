import knex from 'knex';

const db = knex({
    client: 'mysql',
    connection: {
        host: "somethingsold-db.cr6o0assuiva.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "somethingsold123",
        port: "3306",
        database: "somethingsold"
    }
});

export const handler = async (event) => {
    const response = {
        statusCode: 200,
        body: null,
    };

    try {
        const res = await db('item').select();
        response.body = JSON.stringify(res);
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
