// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ServiceManager } from '@jupyterlab/services';
import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { NotebookPage } from '../pages/notebook';
import { FileBrowserPage } from '../pages/filebrowser';

import * as React from 'react';

export interface AppProps {
  kind: string,
  path: string,
  serviceManager: ServiceManager,
  renderMime: RenderMimeRegistry
}

const App = (props: AppProps) => {
  if (props.kind == "notebooks") {
    return (
      <NotebookPage
        notebookPath={props.path}
        serviceManager={props.serviceManager}
        rendermime={props.renderMime}
      />
    );
  } else {
    return (
      <FileBrowserPage
        startingPath={props.path}
        serviceManager={props.serviceManager}
      />
    );
  }
};

export { App };