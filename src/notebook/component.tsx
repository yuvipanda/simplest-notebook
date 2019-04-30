import * as React from 'react';
import { Widget, } from '@phosphor/widgets';
import { NotebookPanel, NotebookActions } from '@jupyterlab/notebook';
import { CmdIds } from '../commands';

import '../../../styles/notebook.css';
import { CommandRegistry } from '@phosphor/commands';
import { Contents } from '@jupyterlab/services';
import { ReactWidget, ToolbarButton } from '@jupyterlab/apputils';

import { HTMLSelect } from '@jupyterlab/ui-components';

class InterfaceSwitcher extends ReactWidget {
  constructor(private commands: CommandRegistry) {
    super();
    this.addClass('jp-Notebook-toolbarCellType');
  }
  onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let target = event.target.value;
    if (target === '-') {
      return;
    }
    this.commands.execute('switch:' + target);
  };

  render = () => {
    return (
      <HTMLSelect
        minimal
        onChange={this.onChange}
        className="jp-Notebook-toolbarCellTypeDropdown"
      >
        <option value="-">Interface</option>
        <option value="lab">JupyterLab</option>
        <option value="classic">Classic</option>
      </HTMLSelect>
    );
  };
}

export interface INotebookProps {
  notebookWidget: NotebookPanel;
  commands: CommandRegistry;
  notebookPath: string;
  id: string;
  className?: string;
  contentsManager: Contents.IManager;
}

interface INotebookState {
  // FIXME: Do I need to dispose of this?
  containerElement: HTMLElement;
}

/**
 * Wraps a NotebookPanel with a dummy <div>
 */
export class NotebookComponent extends React.Component<INotebookProps, INotebookState> {

  constructor(props: INotebookProps) {
    super(props);

    this.addCommands();
    this.addShortcuts();
  }

  componentDidMount() {
    Widget.attach(this.props.notebookWidget, document.getElementById(this.props.id));

    // Handle resize events.
    window.addEventListener('resize', () => {
      this.props.notebookWidget.update();
    });

    this.setupToolbarItems();
  }

  setupToolbarItems = () => {
    const toolbar = this.props.notebookWidget.toolbar;
    const downloadToolBarButton = new ToolbarButton({
      onClick: () => this.props.commands.execute(CmdIds.download),
      tooltip: 'Download notebook to your computer',
      iconClassName: 'jp-MaterialIcon jp-DownloadIcon',
      iconLabel: 'Download notebook'
    });
    const restartAndRunAll = new ToolbarButton({
      iconClassName: 'jp-MaterialIcon sn-RestartAndRunAllIcon',
      iconLabel: 'Restart Kernel & Run All Cells',
      tooltip: 'Restart Kernel & Run All Cells',
      onClick: () => this.props.commands.execute(CmdIds.restartAndRunAll)
    });

    // We insert toolbar items right to left.
    // This way, we can calculate indexes by counting in the default jupyterlab toolbar,
    // and our own toolbar items won't affect our insertion order.j
    // FIXME: Determine dynamically once https://github.com/jupyterlab/jupyterlab/issues/5894 lands
    toolbar.insertItem(
      // Just before the kernel switcher
      10,
      'switch-notebook',
      new InterfaceSwitcher(this.props.commands)
    );
    toolbar.insertItem(
      // Just after restart kernel
      8,
      'restartAndRunAll',
      restartAndRunAll
    );

    toolbar.insertItem(
      // Just after the save button.
      // FIXME: Determine dynamically once https://github.com/jupyterlab/jupyterlab/issues/5894 lands
      1,
      'download-notebook',
      downloadToolBarButton
    );
  };

  render() {
    let className = 'notebook-super-container ';
    if (this.props.className !== undefined) {
      className += this.props.className;
    }
    return <div className={className} id={this.props.id} />;
  }

  addCommands = () => {
    const commands = this.props.commands;
    const nbWidget = this.props.notebookWidget;

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
    commands.addCommand(CmdIds.restartAndRunAll, {
      label: 'Restart Kernel & Run All Cells',
      execute: () => {
        nbWidget.context.session.restart().then(() => {
          NotebookActions.runAll(nbWidget.content, nbWidget.context.session);
        });
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
    commands.addCommand(CmdIds.insertAbove, {
      label: 'Insert Above',
      execute: () => NotebookActions.insertAbove(nbWidget.content)
    });
    commands.addCommand(CmdIds.insertBelow, {
      label: 'Insert Below',
      execute: () => NotebookActions.insertBelow(nbWidget.content)
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
    commands.addCommand('notebook:download', {
      label: 'Download Notebook',
      execute: () => {
        this.props.contentsManager
          .getDownloadUrl(this.props.notebookPath)
          .then(url => {
            window.open(url, '_blank');
          });
      }
    });
  };

  addShortcuts = () => {
    const completerActive = '.jp-mod-completer-active';
    const editModeWithCompleter =
      '.jp-Notebook.jp-mod-editMode .jp-mod-completer-enabled';
    const all = '.jp-Notebook';
    const commandMode = '.jp-Notebook.jp-mod-commandMode:focus';
    const editMode = '.jp-Notebook.jp-mod-editMode';
    let bindings = [
      // Tab / code completor shortcuts
      {
        selector: editModeWithCompleter,
        keys: ['Tab'],
        command: CmdIds.invokeNotebook
      },
      {
        selector: completerActive,
        keys: ['Enter'],
        command: CmdIds.selectNotebook
      },
      // General shortcut available at all times
      { selector: all, keys: ['Shift Enter'], command: CmdIds.runAndAdvance },
      { selector: all, keys: ['Accel S'], command: CmdIds.save }
    ];
    const editModeShortcuts = [
      // Shortcuts available in edit mode
      { keys: ['Ctrl Shift -'], command: CmdIds.split },
      { keys: ['Escape'], command: CmdIds.commandMode }
    ];

    const commandModeShortcuts = [
      // Kernel related shortcuts
      { keys: ['I', 'I'], command: CmdIds.interrupt },
      { keys: ['0', '0'], command: CmdIds.restart },
      // Cell operation shortcuts
      { keys: ['Enter'], command: CmdIds.editMode },
      { keys: ['Shift M'], command: CmdIds.merge },
      { keys: ['Shift K'], command: CmdIds.extendAbove },
      { keys: ['Shift J'], command: CmdIds.extendBelow },
      { keys: ['A'], command: CmdIds.insertAbove },
      { keys: ['B'], command: CmdIds.insertBelow },
      { keys: ['R', 'R'], command: CmdIds.restartAndRunAll },
      // Cell movement shortcuts
      { keys: ['J'], command: CmdIds.selectBelow },
      { keys: ['ArrowDown'], command: CmdIds.selectBelow },
      { keys: ['K'], command: CmdIds.selectAbove },
      { keys: ['ArrowUp'], command: CmdIds.selectAbove },
      // Other shortcuts
      { keys: ['Z'], command: CmdIds.undo },
      { keys: ['Y'], command: CmdIds.redo }
    ];
    commandModeShortcuts.map(binding =>
      this.props.commands.addKeyBinding({ selector: commandMode, ...binding })
    );
    editModeShortcuts.map(binding =>
      this.props.commands.addKeyBinding({ selector: editMode, ...binding })
    );
    bindings.map(binding => this.props.commands.addKeyBinding(binding));
  };
}
