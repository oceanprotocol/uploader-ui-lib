[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean Uploader UI Library</h1>

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
git clone git@github.com:oceanprotocol/uploader-ui-lib.git
cd uploader-ui-lib

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

Integrating Uploader UI into your application is straightforward. The package facilitates seamless uploads but requires a wallet connector library to function optimally. Compatible wallet connection choices include [ConnectKit](https://docs.family.co/), [Web3Modal](https://web3modal.com/), [Dynamic](https://dynamic.xyz/) and [RainbowKit](https://www.rainbowkit.com/docs/installation).

**Step 1:** Install the necessary packages. For instance, if you're using ConnectKit, the installation command would be:

```bash
npm install connectkit @oceanprotocol/uploader-ui-lib
```

**Step 2:** Incorporate the UploaderConnection from the uploader-ui-lib into your app. It's crucial to ensure the component is nested within both the WagmiConfig and ConnectKit providers. Here's a basic implementation:

```bash
import React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import {
  ConnectKitProvider,
  getDefaultConfig,
  ConnectKitButton
} from 'connectkit'
import UploaderConnection from 'uploader-ui-lib'

export default function App () {
  // Initialize the Wagmi client
  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: 'Ocean Uploader UI',
      infuraId: 'Your infura ID',
      chains: [polygon],
      walletConnectProjectId: 'Your wallet connect project ID'
    })
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        {/* Your App */}
        <ConnectKitButton />
        <UploaderConnection
          dbs_url="https://dbs.oceanprotocol.com"
          dbs_account="0x21F2B4d705aC448c9Ff96694Dd9e5901F79f1Ab2"
        />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

```

By following the steps above, you can smoothly incorporate the Uploader UI into your application while ensuring the essential providers wrap the necessary components.

Alternatively, the example below shows how you could use uploader-ui-lib with RainbowKit:

```bash
import React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import UploaderConnection from 'uploader-ui-lib'

export default function App () {
  // Initialize the Wagmi client
  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: 'Ocean Uploader UI',
      infuraId: 'Your infura ID',
      chains: [polygon],
      walletConnectProjectId: 'Your wallet connect project ID'
    })
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider>
        {/* Your App */}
        <ConnectButton />
        <UploaderConnection
          dbs_url="https://dbs.oceanprotocol.com"
          dbs_account="0x21F2B4d705aC448c9Ff96694Dd9e5901F79f1Ab2"
        />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

```

\*\* under development

## NextJS Setup for Ocean Protocol Uploader UI Library

To configure NextJS for the integration of Ocean's Uploader UI library, modify your `next.config.js` file to include these fallbacks:

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
      net: false,
      tls: false
    }
    return config
  }
}
```

\*\* add these fallbacks to avoid any issue related to webpack 5 Polyfills imcompatibility: https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed

install dependencies:

```javascript
> npm install @oceanprotocol/uploader-ui-lib
```

Import the library's CSS into your project:

```javascript
> import '@oceanprotocol/uploader-ui-lib/dist/index.es.css';
```

Dynamically import the Uploader component and ensure it is not processed during server-side rendering (SSR) using the next/dynamic function:

```javascript
import dynamic from 'next/dynamic';
...

const Uploader = dynamic(() => import('@oceanprotocol/uploader-ui-lib').then((module) => module.Uploader), { ssr: false });
```

When incorporating the Uploader component into your application, make sure to set 'use client' on top in your app's component. This ensures that the component operates on the client side, bypassing SSR when rendering:

```javascript
'use client'
import dynamic from 'next/dynamic'
```

This comprehensive setup ensures the proper integration and functioning of the Ocean Protocol's Uploader UI library within a NextJS application.

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

- [**Ways to Contribute →**](https://docs.oceanprotocol.com/contribute)
- [Code of Conduct →](https://docs.oceanprotocol.com/contribute/code-of-conduct)
- [Reporting Vulnerabilities →](https://docs.oceanprotocol.com/contribute#report-vulnerabilities)

## ⬆️ Releases

Releases are managed semi-automatically. They are always manually triggered from a developer's machine with release scripts.

For the GitHub releases steps a GitHub personal access token, exported as `GITHUB_TOKEN` is required. [Setup](https://github.com/release-it/release-it#github-releases)

```bash
export GITHUB_TOKEN="ghp_abc123abc123abc123abc123abc123abc123"
npm run release
```

The task does the following:

- bumps the project version in `package.json`, `package-lock.json`
- auto-generates and updates the CHANGELOG.md file from commit messages
- creates a Git tag
- commits and pushes everything
- creates a GitHub release with commit messages as description
- Git tag push will trigger a GitHub Action workflow to do a npm release

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
