import * as React from 'react';
import { SplitPanel, Widget, CommandPalette } from '@phosphor/widgets';
import { NotebookPanel, NotebookActions } from '@jupyterlab/notebook';
import { CmdIds } from '../commands';

import '../../notebook.css';
import { CommandRegistry } from '@phosphor/commands';

export interface INotebookProps {
  notebookWidget: NotebookPanel;
  commands: CommandRegistry;
  id: string;
  className: string;
}

interface INotebookState {
  // FIXME: Do I need to dispose of this?
  containerElement: HTMLElement;
}

/**
 * Wraps a NotebookPanel with a dummy <div>
 */
export class Notebook extends React.Component<INotebookProps, INotebookState> {
  palette: CommandPalette;

  constructor(props: INotebookProps) {
    super(props);

    this.palette = new CommandPalette({ commands: this.props.commands });
    this.addCommands();
  }

  componentDidMount() {
    let panel = new SplitPanel();
    panel.addClass('notebook-container');
    panel.orientation = 'horizontal';
    panel.spacing = 0;
    SplitPanel.setStretch(this.palette, 0);
    SplitPanel.setStretch(this.props.notebookWidget, 1);
    panel.addWidget(this.palette);
    panel.addWidget(this.props.notebookWidget);

    Widget.attach(panel, document.getElementById(this.props.id));

    // Handle resize events.
    window.addEventListener('resize', () => {
      panel.update();
    });
  }

  render() {
    const className = 'notebook-super-container ' + this.props.className;
    return <div className={className} id={this.props.id} />;
  }

  addCommands = () => {
    const commands = this.props.commands;
    const nbWidget = this.props.notebookWidget;
    const palette = this.palette;
    // Add commands.
    commands.addCommand(CmdIds.invokeNotebook, {
      label: 'Invoke Notebook',
      execute: () => {
        if (nbWidget.content.activeCell.model.type === 'code') {
          return commands.execute(CmdIds.invoke);
        }
      }
    });
    commands.addCommand(CmdIds.selectNotebook, {
      label: 'Select Notebook',
      execute: () => {
        if (nbWidget.content.activeCell.model.type === 'code') {
          return commands.execute(CmdIds.select);
        }
      }
    });
    commands.addCommand(CmdIds.save, {
      label: 'Save',
      execute: () => nbWidget.context.save()
    });
    commands.addCommand(CmdIds.interrupt, {
      label: 'Interrupt',
      execute: () => {
        if (nbWidget.context.session.kernel) {
          nbWidget.context.session.kernel.interrupt();
        }
      }
    });
    commands.addCommand(CmdIds.restart, {
      label: 'Restart Kernel',
      execute: () => nbWidget.context.session.restart()
    });
    commands.addCommand(CmdIds.switchKernel, {
      label: 'Switch Kernel',
      execute: () => nbWidget.context.session.selectKernel()
    });
    commands.addCommand(CmdIds.runAndAdvance, {
      label: 'Run and Advance',
      execute: () => {
        NotebookActions.runAndAdvance(
          nbWidget.content,
          nbWidget.context.session
        );
      }
    });
    commands.addCommand(CmdIds.editMode, {
      label: 'Edit Mode',
      execute: () => {
        nbWidget.content.mode = 'edit';
      }
    });
    commands.addCommand(CmdIds.commandMode, {
      label: 'Command Mode',
      execute: () => {
        nbWidget.content.mode = 'command';
      }
    });
    commands.addCommand(CmdIds.selectBelow, {
      label: 'Select Below',
      execute: () => NotebookActions.selectBelow(nbWidget.content)
    });
    commands.addCommand(CmdIds.selectAbove, {
      label: 'Select Above',
      execute: () => NotebookActions.selectAbove(nbWidget.content)
    });
    commands.addCommand(CmdIds.extendAbove, {
      label: 'Extend Above',
      execute: () => NotebookActions.extendSelectionAbove(nbWidget.content)
    });
    commands.addCommand(CmdIds.extendBelow, {
      label: 'Extend Below',
      execute: () => NotebookActions.extendSelectionBelow(nbWidget.content)
    });
    commands.addCommand(CmdIds.merge, {
      label: 'Merge Cells',
      execute: () => NotebookActions.mergeCells(nbWidget.content)
    });
    commands.addCommand(CmdIds.split, {
      label: 'Split Cell',
      execute: () => NotebookActions.splitCell(nbWidget.content)
    });
    commands.addCommand(CmdIds.undo, {
      label: 'Undo',
      execute: () => NotebookActions.undo(nbWidget.content)
    });
    commands.addCommand(CmdIds.redo, {
      label: 'Redo',
      execute: () => NotebookActions.redo(nbWidget.content)
    });

    let category = 'Notebook Operations';
    [
      CmdIds.interrupt,
      CmdIds.restart,
      CmdIds.editMode,
      CmdIds.commandMode,
      CmdIds.switchKernel
    ].forEach(command => palette.addItem({ command, category }));

    category = 'Notebook Cell Operations';
    [
      CmdIds.runAndAdvance,
      CmdIds.split,
      CmdIds.merge,
      CmdIds.selectAbove,
      CmdIds.selectBelow,
      CmdIds.extendAbove,
      CmdIds.extendBelow,
      CmdIds.undo,
      CmdIds.redo
    ].forEach(command => palette.addItem({ command, category }));

    let bindings = [
      {
        selector: '.jp-Notebook.jp-mod-editMode .jp-mod-completer-enabled',
        keys: ['Tab'],
        command: CmdIds.invokeNotebook
      },
      {
        selector: `.jp-mod-completer-active`,
        keys: ['Enter'],
        command: CmdIds.selectNotebook
      },
      {
        selector: '.jp-Notebook',
        keys: ['Shift Enter'],
        command: CmdIds.runAndAdvance
      },
      {
        selector: '.jp-Notebook',
        keys: ['Accel S'],
        command: CmdIds.save
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['I', 'I'],
        command: CmdIds.interrupt
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['0', '0'],
        command: CmdIds.restart
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Enter'],
        command: CmdIds.editMode
      },
      {
        selector: '.jp-Notebook.jp-mod-editMode',
        keys: ['Escape'],
        command: CmdIds.commandMode
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Shift M'],
        command: CmdIds.merge
      },
      {
        selector: '.jp-Notebook.jp-mod-editMode',
        keys: ['Ctrl Shift -'],
        command: CmdIds.split
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['J'],
        command: CmdIds.selectBelow
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['ArrowDown'],
        command: CmdIds.selectBelow
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['K'],
        command: CmdIds.selectAbove
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['ArrowUp'],
        command: CmdIds.selectAbove
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Shift K'],
        command: CmdIds.extendAbove
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Shift J'],
        command: CmdIds.extendBelow
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Z'],
        command: CmdIds.undo
      },
      {
        selector: '.jp-Notebook.jp-mod-commandMode:focus',
        keys: ['Y'],
        command: CmdIds.redo
      }
    ];
    bindings.map(binding => commands.addKeyBinding(binding));
  };
}
