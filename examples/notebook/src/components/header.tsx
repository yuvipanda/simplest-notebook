import * as React from 'react';

export interface INavbarProps {
  notebookName: string;
}

export const NavBar = (props: INavbarProps) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">
          {props.notebookName}
        </a>
      </div>
    </nav>
  );
};
