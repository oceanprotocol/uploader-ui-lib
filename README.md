[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean DBS UI Library</h1>

**Table of Contents**

- [🏄 Get Started](#-get-started)
- [🚀 Usage](#-usage)
- [👩‍🎤 Storybook](#-storybook)
- [🤖 Testing](#-testing)
- [✨ Code Style](#-code-style)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
- [💖 Contributing](#-contributing)
- [🏛 License](#-license)

## 🏄 Get Started

The lib uses React + TypeScript + CSS modules and will connect to Ocean remote components by default.

Prerequisites:

- [Node.js](https://nodejs.org/en/) (required). Check the [.nvmrc](.nvmrc) file to make sure you are using the correct version of Node.js.
- [nvm](https://github.com/nvm-sh/nvm) (recommended). This is the recommend way to manage Node.js versions.
- [Git](https://git-scm.com/) is required to follow the instructions below.

To start local development:

```bash
git clone git@github.com:oceanprotocol/dbs-ui-lib.git
cd dbs-ui-lib

# when using nvm to manage Node.js versions
nvm use

npm install
# in case of dependency errors, rather use:
# npm install --legacy-peer-deps

npm run build:watch 
# to build the library and watch for changes.
```

Run `npm run build` from the root folder to build the library. This creates `dist` folder which contains everything that
would be published to npm.

# if you encounter this error: Error: error:0308010C:digital envelope routines::unsupported
Run `export NODE_OPTIONS=--openssl-legacy-provider` before building.

## 🚀 Usage

Import and use the DBS UI components in your app:

```bash
import { DBSUploader } from '@oceanprotocol/dbs-ui-lib';

<DBSUploader 
   dbs_url: process.env.DBS_URL,
   dbs_account: process.env.DBS_ACCOUNT,
   infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
   walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID
/>
```

To enable the functionality of the DBSUploader, the following setting variables need to be set:

| Variable                | Description                                           |
|-------------------------|-------------------------------------------------------|
| `dbs_url`               | URL for DBS service communication                    |
| `dbs_account`           | Account info for DBS authentication                  |
| `infuraId`              | Project ID for Ethereum access via Infura            |
| `walletConnectProjectId`| Project ID for WalletConnect integration             |

These variables are needed to interact with the DBS service, provide authentication credentials, access the Ethereum network through Infura, and enable integration with WalletConnect. 

## 👩‍🎤 Storybook

Storybook helps us build UI components in isolation from our app's business logic, data, and context. That makes it easy to develop hard-to-reach states and save these UI states as stories to revisit during development, testing, or QA.

To start adding stories, create a `index.stories.tsx` inside the component's folder:

<pre>
src
└─── components
│   └─── <your component>
│            │   index.tsx
│            │   index.module.css
│            │   <b>index.stories.tsx</b>
│            │   index.test.tsx
</pre>

Starting up the Storybook server with this command will make it accessible under `http://localhost:6006`:

```bash
npm run storybook
```

If you want to build a portable static version under `storybook-static/`:

```bash
npm run storybook:build
```

## 🤖 Testing

Test runs utilize [Jest](https://jestjs.io/) as test runner and [Testing Library](https://testing-library.com/docs/react-testing-library/intro) for writing tests.

Executing a full test run:

```bash
npm test
```

During local development you can continuously get coverage report feedback in your console by running Jest in watch mode:

```bash
npm test:watch
```

## ✨ Code Style

Code style is automatically enforced through [ESLint](https://eslint.org) & [Prettier](https://prettier.io) rules:

For running linting and auto-formatting, you can use from the root of the project:

```bash
# linting check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

## 🛳 Production

To create a production build, run from the root of the project:

```bash
npm run build
```

## ⬆️ Deployment

TBD

## 💖 Contributing

We welcome contributions in form of bug reports, feature requests, code changes, or documentation improvements. Have a look at our contribution documentation for instructions and workflows:

- [**Ways to Contribute →**](https://docs.oceanprotocol.com/concepts/contributing/)
- [Code of Conduct →](https://docs.oceanprotocol.com/concepts/code-of-conduct/)
- [Reporting Vulnerabilities →](https://docs.oceanprotocol.com/concepts/vulnerabilities/)

## 🏛 License

```text
Copyright 2023 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
