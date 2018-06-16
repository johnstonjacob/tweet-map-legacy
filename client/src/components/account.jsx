import React from 'react';

import axios from 'axios';

export default function Account(props){
   
  return (
   <div> 
    {props.loggedIn ?
      (<h1>history</h1>) :
      (
        <form action="/auth/twitter" method="GET">
          <button>login</button>
        </form>
       )
    }
  </div>
)};
