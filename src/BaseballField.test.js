import React from 'react';
import ReactDOM from 'react-dom';
import App from './BaseballField';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BaseballField />, div);
  ReactDOM.unmountComponentAtNode(div);
});
