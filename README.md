<p align="center">
  <img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" alt="seven logo" />
</p>

<h1 align="center">seven Connector for LoopBack 4</h1>

<p align="center">
  Official <a href="https://loopback.io">LoopBack 4</a> connector for sending SMS, placing text-to-speech calls and dispatching RCS messages via the seven gateway.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-teal.svg" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/@seven.io/loopback"><img src="https://img.shields.io/npm/v/@seven.io/loopback" alt="npm" /></a>
  <img src="https://img.shields.io/badge/LoopBack-4-blue" alt="LoopBack 4" />
  <img src="https://img.shields.io/badge/Node.js-14%2B-brightgreen" alt="Node.js 14+" />
</p>

---

## Features

Supports the following [seven REST API](https://docs.seven.io/en/rest-api/first-steps) endpoints:

- [Send SMS](https://docs.seven.io/en/rest-api/endpoints/sms#send-sms)
- [Place Text-to-Speech calls](https://docs.seven.io/en/rest-api/endpoints/voice#send-voice-call)
- [Send RCS messages](https://docs.seven.io/en/rest-api/endpoints/rcs#send-rcs)

## Prerequisites

- LoopBack 4 project
- A [seven account](https://www.seven.io/) with API key ([How to get your API key](https://help.seven.io/en/developer/where-do-i-find-my-api-key))

## Installation

```bash
npm i @seven.io/loopback
# or
yarn add @seven.io/loopback
```

## Setup

### 1. Create a data source

```ts
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core'
import { juggler } from '@loopback/repository'
import { SevenConnector } from '@seven.io/loopback'

const config = {
    apiKey:    process.env.SEVEN_API_KEY,
    connector: SevenConnector,
    name:      'seven',
}

@lifeCycleObserver('datasource')
export class SevenDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName = 'seven'
    static readonly defaultConfig = config

    constructor(
        @inject('datasources.config.seven', { optional: true })
        dsConfig: object = config,
    ) {
        super('seven', dsConfig)
    }
}
```

### 2. Create a model

```ts
import { Model, model, property } from '@loopback/repository'

@model()
export class SevenMessage extends Model {
    @property({ id: true, required: true, type: 'string' })
    operation: 'voice' | 'sms' | 'rcs'

    @property({ required: true,  type: 'string' }) to:   string
    @property({ required: false, type: 'string' }) from: string
    @property({ required: true,  type: 'string' }) text: string

    constructor(data?: Partial<SevenMessage>) { super(data) }
}
```

### 3. Create a service provider

```ts
import { injectable, BindingScope, Provider, inject } from '@loopback/core'
import { GenericService, getService } from '@loopback/service-proxy'
import { SevenDataSource } from '../datasources'
import { SevenMessage } from '../models'

export interface Seven extends GenericService {
    send(data: SevenMessage): Promise<unknown>
}

@injectable({ scope: BindingScope.TRANSIENT })
export class SevenProvider implements Provider<Seven> {
    constructor(
        @inject('datasources.seven')
        protected dataSource: SevenDataSource = new SevenDataSource(),
    ) {}

    value(): Promise<Seven> { return getService(this.dataSource) }
}
```

## Usage

```ts
const msg = new SevenMessage({
    from:      'Acme',
    operation: 'sms',
    text:      'Hello from LoopBack',
    to:        '+491234567890',
})
await sevenProvider.send(msg)
```

Switch `operation` to `voice` for text-to-speech, or `rcs` for RCS messages.

### Payload schemas

| Operation | Fields |
|-----------|--------|
| `sms`   | `from?`, `text`, `to` |
| `voice` | `from?`, `text` (or XML), `to` |
| `rcs`   | `from?` (agent ID), `text`, `to` |

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/) or [open an issue](https://github.com/seven-io/loopback/issues).

## License

[MIT](LICENSE)
