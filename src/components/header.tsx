import '../../../styles/header.css';
import * as React from 'react';

export interface HeaderProps {
  title: string;
}

export class Header extends React.Component<HeaderProps> {
  render = () => {
    return (
      <header className="sn-header">
        <div className="sn-header-title">{this.props.title}</div>
      </header>
    );
  };
}
