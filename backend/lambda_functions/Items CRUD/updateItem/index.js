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

    let itemData;
    try {
        itemData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Invalid JSON format in request body' });
        return response;
    }

    const { id, name, price, dimensions, condition, seller_id, buyer_id, availability_date, address } = itemData;

    try {
        // Check if the seller_id exists in the Users table
        if (seller_id) {
            const sellerExists = await db('Users').where({ id: seller_id }).first();
            if (!sellerExists) {
                response.statusCode = 400;
                response.body = JSON.stringify({ error: 'Invalid seller_id: The specified seller does not exist.' });
                return response;
            }
        }

        await db('item')
            .where({ id })
            .update({
                name,
                price,
                dimensions,
                condition,
                seller_id,
                buyer_id,
                availability_date,
                address
            });

        response.body = JSON.stringify({ message: 'Item updated successfully' });
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: error.message });
    }

    return response;
};
