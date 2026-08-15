import { render } from 'preact';
import './styles/index.css';
import { App } from '~/app';

const root = document.getElementById('app');
if (!root) throw new Error('Elemento #app non trovato in index.html');

render(<App />, root);
