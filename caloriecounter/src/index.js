import initialModel from './Model';
import update from './Update';
import view from './View';
import app from './App';

const node = document.getElementById('app');

app(initialModel, update, view, node);
