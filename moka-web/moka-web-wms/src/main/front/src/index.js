import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Root from './configure';

const cssHasLoaded = (theme) => {
    // test if the theme has loaded by looking for the effect of a known style,
    // in this case we know that the theme applies padding to cells
    const themeEl = document.createElement('div');
    document.body.appendChild(themeEl);
    try {
        themeEl.className = theme;
        const cellEl = document.createElement('div');
        cellEl.className = 'ag-cell';
        themeEl.appendChild(cellEl);
        const computedStyle = window.getComputedStyle(cellEl);
        return parseFloat(computedStyle.paddingLeft) > 0;
    } finally {
        document.body.removeChild(themeEl);
    }
};

const initialize = () => {
    if (cssHasLoaded('ag-theme-wms-grid')) {
        ReactDOM.render(<Root />, document.getElementById('root'));
    } else {
        setTimeout(initialize, 100);
    }
};

initialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
