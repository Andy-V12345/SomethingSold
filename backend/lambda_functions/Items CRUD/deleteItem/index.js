const knex = require('knex');

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

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: null,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    };

    let itemId;
    try {
        itemId = JSON.parse(event.body).id;
    } catch (error) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Invalid JSON format in request body' });
        return response;
    }

    try {
        await db('item')
            .where({ id: itemId })
            .del();

        response.body = JSON.stringify({ message: 'Item deleted successfully' });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
