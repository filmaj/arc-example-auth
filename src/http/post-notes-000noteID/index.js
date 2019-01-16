let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let url = arc.http.helpers.url;

async function route (req) {
    let session = await arc.http.session.read(req);
    let cookie = await arc.http.session.write(session);
    let location = url('/');
    let invalid_request = { status: 400, cookie, location, type: 'application/json' };
    try {
        let note = req.body;
        if (!note) return invalid_request;

        note.accountID = session.account.accountID;
        if (!note.accountID) return invalid_request;

        note.updated = new Date(Date.now()).toISOString();
        await data.notes.put(note);
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
        location: url('/')
    };
}

exports.handler = arc.middleware(auth, route);
