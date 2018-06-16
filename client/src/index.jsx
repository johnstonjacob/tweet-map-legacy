import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Search from './components/Search.jsx';
import Tables from './components/tables.jsx';
import Map from './components/map.jsx';
import Account from './components/account.jsx';
//
// ─── MATERIAL UI THEMING ────────────────────────────────────────────────────────
//
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#212121',
      light: '#ffffff',
      dark: '#bcbcbc'
    },
    secondary: {
      main: '#eeeeee',
      light: '#8e8e8e',
      dark: '#373737'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


//
// ─── APP ────────────────────────────────────────────────────────────────────────
//
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view: 'map',
      history: [],
      currArtistName: null,
      currAlbumUrls: [],
      currAttributes: null,

      welcome: true,
      loading: false,

      loggedIn: false,
      loggedInUsername: null,
      loginError: false,
    };

    this.views = {
      map: () => <Map loggedIn={this.state.loggedIn}/>,
      tables: () => <Tables />,
      account: () => <Account loggedIn={this.state.loggedIn} history={this.state.history} />,
    };
  }

  changeView(option) {
    this.setState({
      view: option
    });
  }
  

  componentDidMount() {
    const options = {
      method: 'GET',
      url: '/auth/loggedin'
    };

    axios(options).then(data => {
      this.setState({loggedIn: data.data.loggedIn, history: data.data.history || []}, console.log(this.state));
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className='App'>
          <Search />
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
          </span>
          <span className={this.state.view === 'account'
            ? 'nav-selected'
            : 'nav-unselected'}
            onClick={() => this.changeView('account')}>
            Account 
          </span>
          <br />
          <br />
          {this.views[this.state.view]()} 
          </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
