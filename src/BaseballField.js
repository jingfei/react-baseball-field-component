import React from 'react';
import { Field } from './Field';

export class BaseballField extends React.Component {
  render() {
    return <Field style={{ width: '100%', height: '100%' }} width={500} height={500} />;
  }
}

