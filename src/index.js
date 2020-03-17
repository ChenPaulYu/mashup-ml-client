import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';


import './index.css';
import 'typeface-roboto';
import WebFont from 'webfontloader';

WebFont.load({
    google: {
        families: ['Baloo Bhai 2']
    }
});


ReactDOM.render(<App />, document.getElementById('root'));

