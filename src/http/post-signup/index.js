let arc = require('@architect/functions');
let data = require('@architect/data');
let url = arc.http.helpers.url;
let hash = require('bcryptjs').hashSync;
let salt_rounds = 12;

exports.handler = async function create_account (req) {
    let location = url('/');
    let session = await arc.http.session.read(req);
    let email = req.body.email;
    if (!email || !email.length) {
        return {
            status: 400,
            type: 'application/json',
            body: JSON.stringify({error: 'no email provided'})
        };
    }
    // test if account already exists
    try {
        let account = await data.accounts.get({accountID: email});
        if (account && account.accountID === email) {
            return {
                status: 400,
                type: 'application/json',
                body: JSON.stringify({error: 'email already registered'})
            };
        }
    } catch (e) {
        return {
            status: 500,
            type: 'application/json',
            body: JSON.stringify(e)
        };
    }
    // create the account
    try {
        let password = req.body.password;
        let hashed = hash(password, salt_rounds);
        let account = {accountID: email, hash: hashed};
        let result = await data.accounts.put(account);
        if (result && result.accountID) {
            delete result.hash;
            session.account = account;
            console.log('session', session);
        } else {
            return {
                status: 500,
                type: 'application/json',
                body: JSON.stringify({err: 'error during account creation, got unexpected result from db', result})
            };
        }
    } catch (e) {
        return {
            status: 500,
            type: 'application/json',
            body: JSON.stringify(e)
        };
    }
    return {
        status: 302,
        cookie: await arc.http.session.write(session),
        location
    };
};
