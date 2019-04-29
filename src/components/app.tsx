// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ServiceManager } from '@jupyterlab/services';
import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { NotebookPage } from '../pages/notebook';

import * as React from 'react';

export interface AppProps {
  kind: string,
  path: string,
  serviceManager: ServiceManager,
  renderMime: RenderMimeRegistry
}

const App = (props: AppProps) => {
  return (
    <NotebookPage
      notebookPath={props.path}
      serviceManager={props.serviceManager}
      rendermime={props.renderMime}
    />
  );
};

export { App };