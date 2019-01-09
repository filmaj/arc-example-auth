let arc = require('@architect/functions');
let layout = require('@architect/shared/views/layout');
let url = arc.http.helpers.url;

exports.handler = async function http (req) {
    let session = await arc.http.session.read(req);
    let title = 'Sign Up';
    let body = `
    <div class="card mt-5 mr-auto ml-auto mb-1 w-25">
      <h2>Sign Up</h2>
      <div class=card-body>

        <form action=${url('/signup')} method=post>
          <div class=form-group>
            <label for=email>Email address</label>
            <input type=email class=form-control name=email placeholder="Enter email">
          </div>
          <div class=form-group>
            <label for=password>Password</label>
            <input type=password class=form-control name=password placeholder="Password">
          </div>
          <button type=submit class="btn btn-primary float-left">Sign Up</button>
        </form>
      </div>
    </div>`;
    return {
        status: 200,
        type: 'text/html',
        body: layout({body, title, session, path: '/signup'})
    };
};
