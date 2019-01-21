// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CommandRegistry } from '@phosphor/commands';

import { CommandPalette, Widget } from '@phosphor/widgets';

import { ServiceManager } from '@jupyterlab/services';

import {
  NotebookPanel,
  NotebookWidgetFactory,
  NotebookModelFactory
} from '@jupyterlab/notebook';

import { Completer, CompletionHandler } from '@jupyterlab/completer';

import { editorServices } from '@jupyterlab/codemirror';

import { DocumentManager } from '@jupyterlab/docmanager';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { NavBar } from './header';
import { Notebook } from './notebook';
import { CompleterComponent } from './completer';

import * as React from 'react';

interface AppState {
  notebookName: string;
}

interface AppProps {
  serviceManager: ServiceManager.IManager;
  notebookPath: string;
  rendermime: RenderMimeRegistry;
}

/**
 * Notebook application component
 */
export class App extends React.Component<AppProps, AppState> {
  commands: CommandRegistry;
  palette: CommandPalette;
  nbWidget: NotebookPanel;
  completer: Completer;
  completionHandler: CompletionHandler;

  constructor(props: AppProps) {
    super(props);

    // Initialize the command registry with the bindings.
    this.commands = new CommandRegistry();
    let useCapture = true;

    // Setup the keydown listener for the document.
    document.addEventListener(
      'keydown',
      event => {
        this.commands.processKeydownEvent(event);
      },
      useCapture
    );

    let opener = {
      open: (widget: Widget) => {
        // Do nothing for sibling widgets for now.
      }
    };

    let docRegistry = new DocumentRegistry();
    let docManager = new DocumentManager({
      registry: docRegistry,
      manager: this.props.serviceManager,
      opener
    });
    let mFactory = new NotebookModelFactory({});
    let editorFactory = editorServices.factoryService.newInlineEditor;
    let contentFactory = new NotebookPanel.ContentFactory({ editorFactory });

    let wFactory = new NotebookWidgetFactory({
      name: 'Notebook',
      modelName: 'notebook',
      fileTypes: ['notebook'],
      defaultFor: ['notebook'],
      preferKernel: true,
      canStartKernel: true,
      rendermime: this.props.rendermime,
      contentFactory,
      mimeTypeService: editorServices.mimeTypeService
    });
    docRegistry.addModelFactory(mFactory);
    docRegistry.addWidgetFactory(wFactory);

    this.nbWidget = docManager.open(this.props.notebookPath) as NotebookPanel;

    this.state = { notebookName: this.props.notebookPath };

    this.nbWidget.model.stateChanged.connect(this.onNotebookStateChanged);
  }

  onNotebookStateChanged = () => {
    this.setState({
      notebookName: this.nbWidget.context.path
    });
  };

  render() {
    return [
      <NavBar key="navbar" notebookName={this.state.notebookName} />,
      <Notebook
        key="notebook"
        id="main-container"
        className="container"
        commands={this.commands}
        notebookWidget={this.nbWidget}
      />,
      <CompleterComponent
        key="completer"
        commands={this.commands}
        notebookPanel={this.nbWidget}
      />
    ];
  }
}
