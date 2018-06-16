import React from 'react';

import axios from 'axios';

export default function Account(props) {
  console.log(props);
  return (
    <div>
      {props.loggedIn ? (
        <div>
          <h1>history</h1>
          <ul>{props.history.map(item => <li>{item}</li>)}</ul>
        </div>
      ) : (
        <form action="/auth/twitter" method="GET">
          <button>login</button>
        </form>
      )}
    </div>
  );
}
