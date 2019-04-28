import '../../../styles/header.css';
import * as React from 'react';
import { CommandRegistry } from '@phosphor/commands';

export interface HeaderProps {
  title: string;
  commandRegistry: CommandRegistry;
  commandsOrganization: string[];
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
