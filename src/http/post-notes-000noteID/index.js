let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let url = arc.http.helpers.url;

async function route (req) {
    let session = await arc.http.session.read(req);
    try {
        let note = req.body;
        // TODO: what if body is empty?
        note.accountID = session.account.accountID;
        note.updated = new Date(Date.now()).toISOString();
        // save the note
        // TODO: consider using `update` instead of `put`
        let result = await data.notes.put(note);
        // log it to stdout
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    return {
        status: 302,
        cookie: await arc.http.session.write(session),
        location: url('/')
    };
}

exports.handler = arc.middleware(auth, route);
