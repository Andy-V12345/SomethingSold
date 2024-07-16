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

    let itemData;
    try {
        itemData = JSON.parse(event.body);
    } catch (error) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Invalid JSON format in request body' });
        return response;
    }

    const { id, name, price, dimensions, condition, image_path, seller_id, buyer_id, availability_date } = itemData;

    try {
        await db('item')
            .where({ id })
            .update({
                name,
                price,
                dimensions,
                condition,
                image_path,
                seller_id,
                buyer_id,
                availability_date
            });

        response.body = JSON.stringify({ message: 'Item updated successfully' });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
