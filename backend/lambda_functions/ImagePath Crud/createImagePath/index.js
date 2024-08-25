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

    try {
        // Parse the event body
        const imagePathData = typeof event.body === 'string' ? JSON.parse(event.body) : event;

        const { path, item_id } = imagePathData;

        // Insert the image path into the database without specifying the id
        const [insertedId] = await db('image_paths').insert({
            path,
            item_id
        });

        response.body = JSON.stringify({ message: 'Image path created successfully', imagePathId: insertedId });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
