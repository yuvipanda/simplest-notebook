import '../../../styles/header.css';
import * as React from 'react';

interface HeaderProps {
  title: string
}

export let Header = (props: HeaderProps) => {
  return (
    <header className="sn-header">
      <div className="sn-header-title">{props.title}</div>
    </header>
  );
};