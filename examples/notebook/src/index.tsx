// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import 'es6-promise/auto'; // polyfill Promise on IE
import '@jupyterlab/application/style/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@jupyterlab/theme-light-extension/style/index.css';
import '../../styles/index.css';

import { ServiceManager } from '@jupyterlab/services';
import { MathJaxTypesetter } from '@jupyterlab/mathjax2';

import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { PageConfig } from '@jupyterlab/coreutils';

import { App } from './components/app';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

function main(): void {
  let manager = new ServiceManager();

  manager.ready.then(() => {
    let notebookPath = PageConfig.getOption('notebookPath');
    const rendermime = new RenderMimeRegistry({
      initialFactories: initialFactories,
      latexTypesetter: new MathJaxTypesetter({
        url: PageConfig.getOption('mathjaxUrl'),
        config: PageConfig.getOption('mathjaxConfig')
      })
    });

    ReactDOM.render(
      <App
        notebookPath={notebookPath}
        serviceManager={manager}
        rendermime={rendermime}
      />,
      document.getElementById('everything-container')
    );
  });
}

window.addEventListener('load', main);
