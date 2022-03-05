import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class TestingComp extends Component {
    render() {
        return (
            <h1>Hello React Worlds!</h1>
        );
    }
}

ReactDOM.render(<TestingComp />, document.getElementById('root'));
