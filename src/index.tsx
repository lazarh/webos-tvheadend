// Polyfills required by webOS 3.x TVs (Chromium 38): Object.assign, Array.find/findIndex,
// Object.entries, String.includes, URLSearchParams, etc. Must run before any other module
// (Enact's resolution module uses Object.assign at module-init time and crashes the whole
// app without this; ilib uses Array.includes during the first render).
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import { AppContextProvider } from './AppContext';

const AppBase = kind({
    name: 'App',
    render: () => (
        <AppContextProvider>
            <App />
        </AppContextProvider>
    )
});

const DecoratedApp = MoonstoneDecorator(AppBase);

ReactDOM.render(
    <React.StrictMode>
        <DecoratedApp />
    </React.StrictMode>,
    document.getElementById('root')
);
