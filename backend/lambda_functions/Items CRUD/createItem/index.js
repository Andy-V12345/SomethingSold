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
        const itemData = typeof event.body === 'string' ? JSON.parse(event.body) : event;

        const { name, price, dimensions, condition, image_path, seller_id, buyer_id, availability_date } = itemData;

        // Insert the item into the database without specifying the id
        const [insertedId] = await db('item').insert({
            name,
            price,
            dimensions,
            condition,
            image_path,
            seller_id: seller_id || null, // Handle null value
            buyer_id: buyer_id || null,    // Handle null value,
            availability_date
        });

        response.body = JSON.stringify({ message: 'Item created successfully', itemId: insertedId });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
