// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';

import { each } from '@phosphor/algorithm';
import { CommandRegistry } from '@phosphor/commands';

import { SplitPanel, Widget, Menu } from '@phosphor/widgets';

import { FileBrowser } from '@jupyterlab/filebrowser';

import { ServiceManager, Contents } from '@jupyterlab/services';

export interface IFileBrowserProps {
  id: string;
  className?: string;
  serviceManager: ServiceManager.IManager;
  fileBrowser: FileBrowser;
  openItem: (item: Contents.IModel) => void
}

/**
 * Wraps a NotebookPanel with a dummy <div>
 */
export class FileBrowserComponent extends React.Component<IFileBrowserProps> {
  widgets: Widget[] = [];
  activeWidget: Widget;
  commands: CommandRegistry = new CommandRegistry();

  constructor(props: IFileBrowserProps) {
    super(props);

    this.addCommands();
  }

  render() {
    return ([
      <p><strong>Note:</strong> For now, right click and select Open to open notebooks and files</p>,
      <div className="filebrowser-super-container" id={this.props.id} />,
    ]);
  }

  componentDidMount() {
    let panel = new SplitPanel();
    panel.addClass('filebrowser-container');
    panel.addWidget(this.props.fileBrowser);
    SplitPanel.setStretch(this.props.fileBrowser, 0);

    document.addEventListener('focus', event => {
      for (let i = 0; i < this.widgets.length; i++) {
        let widget = this.widgets[i];
        if (widget.node.contains(event.target as HTMLElement)) {
          this.activeWidget = widget;
          break;
        }
      }
    });

    // Attach the panel to the DOM.
    Widget.attach(panel, document.getElementById(this.props.id));

    // Create a context menu.
    let menu = new Menu({ commands: this.commands });
    menu.addItem({ command: 'file-open' });
    menu.addItem({ command: 'file-rename' });
    menu.addItem({ command: 'file-remove' });
    menu.addItem({ command: 'file-duplicate' });
    menu.addItem({ command: 'file-delete' });
    menu.addItem({ command: 'file-cut' });
    menu.addItem({ command: 'file-copy' });
    menu.addItem({ command: 'file-paste' });
    menu.addItem({ command: 'file-shutdown-kernel' });
    menu.addItem({ command: 'file-dialog-demo' });
    menu.addItem({ command: 'file-info-demo' });

    // Add a context menu to the dir listing.
    let node = this.props.fileBrowser.node.getElementsByClassName('jp-DirListing-content')[0];
    node.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      let x = event.clientX;
      let y = event.clientY;
      menu.open(x, y);
    });


    // Handle resize events.
    window.addEventListener('resize', () => {
      panel.update();
    });
  }


  addCommands() {
    let commands = this.commands;
    commands.addCommand('file-open', {
      label: 'Open',
      icon: 'fa fa-folder-open-o',
      mnemonic: 0,
      execute: () => {
        each(this.props.fileBrowser.selectedItems(), item => {
          this.props.openItem(item);
        });
      }
    });
    commands.addCommand('file-rename', {
      label: 'Rename',
      icon: 'fa fa-edit',
      mnemonic: 0,
      execute: () => {
        return this.props.fileBrowser.rename();
      }
    });
    commands.addCommand('file-cut', {
      label: 'Cut',
      icon: 'fa fa-cut',
      execute: () => {
        this.props.fileBrowser.cut();
      }
    });
    commands.addCommand('file-copy', {
      label: 'Copy',
      icon: 'fa fa-copy',
      mnemonic: 0,
      execute: () => {
        this.props.fileBrowser.copy();
      }
    });
    commands.addCommand('file-delete', {
      label: 'Delete',
      icon: 'fa fa-remove',
      mnemonic: 0,
      execute: () => {
        return this.props.fileBrowser.delete();
      }
    });
    commands.addCommand('file-duplicate', {
      label: 'Duplicate',
      icon: 'fa fa-copy',
      mnemonic: 0,
      execute: () => {
        return this.props.fileBrowser.duplicate();
      }
    });
    commands.addCommand('file-paste', {
      label: 'Paste',
      icon: 'fa fa-paste',
      mnemonic: 0,
      execute: () => {
        return this.props.fileBrowser.paste();
      }
    });
    commands.addCommand('file-download', {
      label: 'Download',
      icon: 'fa fa-download',
      execute: () => {
        return this.props.fileBrowser.download();
      }
    });

    commands.addKeyBinding({
      keys: ['Enter'],
      selector: '.jp-DirListing',
      command: 'file-open'
    });
    commands.addKeyBinding({
      keys: ['Accel S'],
      selector: '.jp-CodeMirrorEditor',
      command: 'file-save'
    });
    window.addEventListener('keydown', event => {
      commands.processKeydownEvent(event);
    });
  }
}