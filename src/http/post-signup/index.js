let arc = require('@architect/functions');
let data = require('@architect/data');
let url = arc.http.helpers.url;
let hash = require('bcryptjs').hashSync;
let salt_rounds = 12;

exports.handler = async function create_account (req) {
    console.log(req);
    let location = url('/');
    let session = {};
    try {
        let password = req.body.password;
        let hashed = hash(password, salt_rounds);
        let account = {accountID: req.body.email, hash: hashed};
        session.account = account;
        let result = await data.accounts.put(account);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
    return {
        status: 302,
        cookie: await arc.http.session.write(session),
        location
    };
};
