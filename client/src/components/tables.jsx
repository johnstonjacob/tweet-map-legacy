import React from 'react';
import axios from 'axios';

import Table from './table.jsx'

class Tables extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stateWords: []
    };

    this.getKeywords = this.getKeywords.bind(this);
  }

  componentDidMount() {
    this.getKeywords();
  }

  getKeywords() {
    axios.get('/keywords')
      .then((res) => {
        this.setState({
          stateWords: res.data
        })
      })
  }

  render() {
    return(
      <div>
        <h1>Tables Page</h1>
        {this.state.stateWords.map((curState, ind) => {
          return <Table key={ind} ind={ind} state={curState.state} keywords={curState.keywords}/>;
        })}
      </div>
    );
  }
}

export default Tables;