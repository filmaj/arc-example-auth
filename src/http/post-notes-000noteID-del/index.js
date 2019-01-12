let arc = require('@architect/functions');
let data = require('@architect/data');
let url = arc.http.helpers.url;

exports.handler = async function route (req) {
    let noteID = req.params.noteID;
    let session = await arc.http.session.read(req);
    let accountID = session.account.accountID;
    // TODO: what happens if this fails?
    await data.notes.delete({
        noteID, accountID
    });
    return {
        status: 302,
        cookie: await arc.http.session.write(session),
        location: url('/')
    };
};
