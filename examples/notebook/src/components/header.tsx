import '../../../styles/header.css';
import * as React from 'react';
import { CommandRegistry } from '@phosphor/commands';

export interface HeaderProps {
  title: string;
  commandRegistry: CommandRegistry;
  commandsOrganization: string[];
}

export class Header extends React.Component<HeaderProps> {
  /* We shouldn't be using bootstrap for this */
  getDropdownItems = () => {
    const registry = this.props.commandRegistry;
    let items: React.ReactElement<HTMLElement>[] = [];
    for (let command of this.props.commandsOrganization) {
      // FIXME: THis is a terrible idea, should be its own type
      let item: React.ReactElement<HTMLElement>;
      if (command === '-') {
        item = <div className="dropdown-divider" />;
      } else {
        item = (
          <button
            key={command}
            onClick={() => registry.execute(command)}
            className="dropdown-item"
          >
            {registry.label(command)}
          </button>
        );
      }
      items.push(item);
    }
    return items;
  };

  render = () => {
    return (
      <header className="sn-header">
        <div className="sn-header-title">{this.props.title}</div>
        <div className="dropdown">
          <button
            id="sn-header-menu-dropdown"
            className="sn-more-menu-button btn dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <div
            className="dropdown-menu"
            aria-labelledby="sn-header-menu-dropdown"
          >
            {this.getDropdownItems()}
          </div>
        </div>
      </header>
    );
  };
}
