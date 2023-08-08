![](https://www.seven.io/wp-content/uploads/Logo.svg "seven Logo")

## loopback-connector-seven

The official [seven](http://www.seven.io/) connector for [LoopBack](https://loopback.io).
Prior to using you will need to [create an API key](https://help.seven.io/en/api-key-access).

This connector supports the following endpoints of
the [seven REST API](https://www.seven.io/en/docs/gateway/http-api/):

- [Sending SMS](https://www.seven.io/en/docs/gateway/http-api/sms-dispatch/)
- [Making text-to-speech calls](https://www.seven.io/en/docs/gateway/http-api/voice/)

## Installation

In your LoopBack project:

### NPM

    $ npm i loopback-connector-seven

### Yarn

    $ yarn add loopback-connector-seven

## Setup

### Create a data source

```typescript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core'
import {juggler} from '@loopback/repository'
import {SevenConnector} from 'loopback-connector-seven'

const config = {
    apiKey: process.env.SEVEN_API_KEY,
    connector: SevenConnector,
    name: 'seven',
}

@lifeCycleObserver('datasource')
export class SevenDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName = 'seven'
    static readonly defaultConfig = config

    constructor(
        @inject('datasources.config.seven', {optional: true})
            dsConfig: object = config,
    ) {
        super('seven', dsConfig)
    }
}

```

### Create a model

```typescript
import {Model, model, property} from '@loopback/repository';

@model()
export class SevenMessage extends Model {
    @property({
        generated: false,
        id: true,
        required: true,
        type: 'string',
    })
    operation: 'voice' | 'sms';

    @property({
        required: true,
        type: 'string',
    })
    to: string;

    @property({
        required: false,
        type: 'string',
    })
    from: string;

    @property({
        required: true,
        type: 'string',
    })
    text: string;

    constructor(data?: Partial<SevenMessage>) {
        super(data);
    }
}

export interface SevenRelations {
    // describe navigational properties here
}

export type SevenWithRelations = SevenMessage & SevenRelations;
```

### Create a service

```typescript
import {injectable, BindingScope, Provider, inject} from '@loopback/core'
import {GenericService, getService} from '@loopback/service-proxy'
import {SevenDataSource} from '../datasources'
import {SevenMessage} from '../models'

export interface Seven extends GenericService {
    send(data: SevenMessage): Promise<unknown>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class SevenProvider implements Provider<Seven> {
    constructor(
        @inject('datasources.seven')
        protected dataSource: SevenDataSource = new SevenDataSource(),
    ) {
    }

    value(): Promise<Seven> {
        return getService(this.dataSource)
    }
}
```

## Usage

### Send SMS

```typescript
import {inject} from '@loopback/core'
import {post} from '@loopback/rest'
import {SevenMessage} from '../models'
import {Seven} from '../services'

export class SmsController {
    @post('/send-sms')
    async sms(
        @inject('services.Seven') sevenProvider: Seven,
    ): Promise<void> {
        const msg = new SevenMessage({
            from: 'optional sender ID',
            operation: 'sms',
            text: 'This is a test SMS from LoopBack via seven',
            to: 'phone number(s) for calling separated by comma',
        })

        try {
            const json = await sevenProvider.send(msg)
            console.log('json', json)
        } catch (e) {
            console.error('e', e)

            throw e
        }
    }
}
```

### Make a text-to-speech call

```typescript
import {inject} from '@loopback/core'
import {post} from '@loopback/rest'
import {SevenMessage} from '../models'
import {Seven} from '../services'

export class TextToSpeechController {
    @post('/send-voice')
    async voice(
        @inject('services.Seven') sevenProvider: Seven,
    ): Promise<void> {
        const msg = new SevenMessage({
            from: 'optional caller ID',
            operation: 'voice',
            text: 'This is a test call from LoopBack via seven',
            to: 'the number for calling',
        })

        try {
            const json = await sevenProvider.send(msg)
            console.log('json', json)
        } catch (e) {
            console.error('e', e)

            throw e
        }
    }
}
```

## Options

### Send SMS

    {
        from: 'OPTIONAL_SENDER_ID',
        operation: 'sms',
        text: 'TEXT_MESSAGE',
        to: 'TARGET_PHONE_NUMBER(S)'
    }

### Make a text-to-speech call

    {
        from: 'OPTIONAL_CALLER_ID',
        operation: 'call',
        text: 'TEXT_OR_XML',
        to: 'TARGET_PHONE_NUMBER'
    }

### Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
