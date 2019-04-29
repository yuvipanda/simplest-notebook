// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import 'es6-promise/auto'; // polyfill Promise on IE
import '@jupyterlab/application/style/index.css';
import '@jupyterlab/theme-light-extension/style/index.css';

import { ServiceManager } from '@jupyterlab/services';
import { MathJaxTypesetter } from '@jupyterlab/mathjax2';

import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { PageConfig } from '@jupyterlab/coreutils';

import { App } from './components/app';
// Our custom styles
import '../../styles/index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

type KindType = "tree" | "notebook";

function main(): void {
  let manager = new ServiceManager();

  manager.ready.then(() => {
    let kind = PageConfig.getOption('kind') as KindType;
    let path = PageConfig.getOption('path');
    const rendermime = new RenderMimeRegistry({
      initialFactories: initialFactories,
      latexTypesetter: new MathJaxTypesetter({
        url: PageConfig.getOption('mathjaxUrl'),
        config: PageConfig.getOption('mathjaxConfig')
      })
    });

    ReactDOM.render(
      <App
        kind={kind}
        path={path}
        serviceManager={manager}
        renderMime={rendermime}
      />,
      document.getElementById('everything-container')
    );
  });
}

window.addEventListener('load', main);
