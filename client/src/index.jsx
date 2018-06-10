import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Tables from './components/tables.jsx'
import Map from './components/map.jsx'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view: 'map',
    };
  }

  changeView(option) {
    this.setState({
      view: option
    });
  }

  render() {
    return(
      <div className='App'>
        <span className={this.state.view === 'map'
          ? 'nav-selected'
          : 'nav-unselected'}
          onClick={() => this.changeView('map')}>
          Map
        </span>
        <span className={this.state.view === 'tables'
          ? 'nav-selected'
          : 'nav-unselected'}
          onClick={() => this.changeView('tables')}>
          Tables
          <br></br>
          <br></br>
        </span>
        {/* <h1>Hello, World!</h1>
        <p>Team Twit 4 Lyfe!</p> */}
        {this.state.view === 'map'
          ? <Map />
          : <Tables />}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
