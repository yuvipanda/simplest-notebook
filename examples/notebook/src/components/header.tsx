import '../../../styles/header.css';
import * as React from 'react';

export interface HeaderProps {
  title: string;
}

export const Header = (props: HeaderProps) => {
  return (
    <header>
      <a className="sn-header-title">{props.title}</a>
    </header>
  );
};
