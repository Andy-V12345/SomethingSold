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

    try {
        // Parse the event body
        const itemData = typeof event.body === 'string' ? JSON.parse(event.body) : event;

        const { name, price, dimensions, condition, address, seller_id, buyer_id, availability_date } = itemData;

        // Insert the item into the database
        const item_id = await db('item').insert({
            name,
            price,
            dimensions,
            condition,
            seller_id: seller_id || null, // Handle null value
            buyer_id: buyer_id || null,    // Handle null value
            availability_date,
            address
        }, ['id']);

        response.body = JSON.stringify({ 
            message: 'Item created successfully',
            item_id: item_id
        });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
