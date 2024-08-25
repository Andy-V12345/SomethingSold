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
    };

    const { id } = event.pathParameters;

    try {
        const result = await db('ImagePath')
            .where({ id })
            .del();

        if (result) {
            response.body = JSON.stringify({ message: 'ImagePath deleted successfully' });
        } else {
            response.statusCode = 404;
            response.body = JSON.stringify({ error: 'ImagePath not found' });
        }
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
