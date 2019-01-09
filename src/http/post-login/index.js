let arc = require('@architect/functions');
let data = require('@architect/data');
let url = arc.http.helpers.url;
let compare = require('bcryptjs').compareSync;

async function login (req, res) {
    let location = url('/');
    let session = {};
    try {
        let result = await data.accounts.query({
            KeyConditionExpression: 'accountID = :accountID',
            ExpressionAttributeValues: {
                ':accountID': req.body.email
            }
        });
        console.log('account?', result);
        if (result && result.Items && result.Items.length) {
            let account = result.Items.filter((item) => item.accountID === req.body.email)[0];
            let stored = account.hash;
            let authorized = compare(req.body.password, stored);
            if (authorized) {
                delete account.hash;
                session.account = account;
            }
        }
    } catch (e) {
        console.error(e);
    }
    res({session, location});
}

exports.handler = arc.http(login);
