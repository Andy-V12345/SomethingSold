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

    let imagePathData;
    try {
        imagePathData = JSON.parse(event.body);
    } catch (error) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Invalid JSON format in request body' });
        return response;
    }

    const { id, path } = imagePathData;

    try {
        const result = await db('ImagePath')
            .where({ id })
            .update({ path });

        if (result === 0) {
            response.statusCode = 404;
            response.body = JSON.stringify({ error: 'Image path not found' });
        } else {
            response.body = JSON.stringify({ message: 'Image path updated successfully' });
        }
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
