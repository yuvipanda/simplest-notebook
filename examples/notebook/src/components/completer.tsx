// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { CommandRegistry } from '@phosphor/commands';
import { Widget } from '@phosphor/widgets';
import { NotebookPanel } from '@jupyterlab/notebook';
import {
  CompleterModel,
  Completer,
  CompletionHandler,
  KernelConnector
} from '@jupyterlab/completer';
import { CmdIds } from '../commands';
import * as React from 'react';

interface CompleterProps {
  notebookPanel: NotebookPanel;
  commands: CommandRegistry;
}

export class CompleterComponent extends React.Component<CompleterProps> {
  handler: CompletionHandler;
  completer: Completer;

  constructor(props: CompleterProps) {
    super(props);

    const editor =
      this.props.notebookPanel.content.activeCell &&
      this.props.notebookPanel.content.activeCell.editor;
    const model = new CompleterModel();
    this.completer = new Completer({ editor, model });
    const connector = new KernelConnector({
      session: this.props.notebookPanel.session
    });
    this.handler = new CompletionHandler({
      completer: this.completer,
      connector
    });
    // Set the handler's editor.
    this.handler.editor = editor;

    // Listen for active cell changes.
    this.props.notebookPanel.content.activeCellChanged.connect(
      (sender, cell) => {
        this.handler.editor = cell && cell.editor;
      }
    );

    // Hide the widget when it first loads.
    this.completer.hide();

    this.addCommands();
  }

  componentDidMount = () => {
    Widget.attach(this.completer, document.body);
  };

  render = () => {
    return <div />;
  };

  addCommands = () => {
    this.props.commands.addCommand(CmdIds.invoke, {
      label: 'Completer: Invoke',
      execute: () => this.handler.invoke()
    });
    this.props.commands.addCommand(CmdIds.select, {
      label: 'Completer: Select',
      execute: () => this.handler.completer.selectActive()
    });
  };
}
