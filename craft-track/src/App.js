import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Main />
      </div>
    );
  }
}
export default App;