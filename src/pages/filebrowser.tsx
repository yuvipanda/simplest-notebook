// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CommandRegistry } from '@phosphor/commands';

import { Header } from '../components/header';

import { DockPanel, Widget } from '@phosphor/widgets';

import { ServiceManager } from '@jupyterlab/services';


import { FileBrowser, FileBrowserModel } from '@jupyterlab/filebrowser';

import { DocumentManager } from '@jupyterlab/docmanager';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import * as React from 'react';
import { FileBrowserComponent } from '../components/filebrowser';

import '../../../styles/filebrowser.css';
import { IChangedArgs } from '@jupyterlab/coreutils';

export interface FileBrowserPageProps {
  serviceManager: ServiceManager.IManager;
  startingPath: string;
}

export interface FileBrowserPageState {
  currentPath: string
}

/**
 * Notebook application component
 */
export class FileBrowserPage extends React.Component<FileBrowserPageProps, FileBrowserPageState> {
  fileBrowser: FileBrowser;
  widgets: Widget[] = [];
  activeWidget: Widget;
  dock: DockPanel;
  docManager: DocumentManager;
  commands: CommandRegistry;

  constructor(props: FileBrowserPageProps) {
    super(props);

    this.state = {
      currentPath: this.props.startingPath
    };

    let opener = {
      open: (widget: Widget) => {
      }
    };

    let docRegistry = new DocumentRegistry();
    this.docManager = new DocumentManager({
      registry: docRegistry,
      manager: this.props.serviceManager,
      opener
    });

    let fbModel = new FileBrowserModel({
      manager: this.docManager,
    });
    fbModel.cd(this.state.currentPath);
    this.fileBrowser = new FileBrowser({
      id: 'filebrowser',
      model: fbModel
    });

    fbModel.pathChanged.connect(this.pathChanged);
  }

  pathChanged = (browserModel: FileBrowserModel, changeProps: IChangedArgs<string>) => {
    this.setState({
      currentPath: changeProps.newValue
    });
  }

  render() {
    // Put a / before and after path
    let displayPath = this.state.currentPath;
    if (!displayPath.startsWith('/')) {
      displayPath = '/' + displayPath;
    }
    if (!displayPath.endsWith('/')) {
      displayPath = displayPath + '/';
    }
    return [
      <Header
        key="header"
        title={displayPath}
      />,
      <FileBrowserComponent
        key="browser"
        id="main-container"
        docManager={this.docManager}
        fileBrowser={this.fileBrowser}
        serviceManager={this.props.serviceManager}
      />
    ];
  }
}
