'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: data.name,
            longName: data.longName,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor
        }
    };

    // write the team to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create team.  Message: ' + JSON.stringify(error)
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: params.Item,
        };
        callback(null, response);
    });
};