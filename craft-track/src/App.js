import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Home />
      </div>
    );
  }
}
export default App;