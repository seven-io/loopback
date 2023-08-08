import assert from 'assert'
import fetch from 'node-fetch'
import SevenClient from 'sms77-client'
import {SevenDataAccessObject} from './SevenDataAccessObject'
import {DataSource, SevenConnectorOptions} from './types'

if (!globalThis.fetch) globalThis.fetch = fetch as unknown as typeof globalThis.fetch

export class SevenConnector {
    DataAccessObject: SevenDataAccessObject
    client: SevenClient
    dataSource?: DataSource
    name = 'SevenConnector'

    constructor(public options: SevenConnectorOptions) {
        assert(
            typeof options === 'object',
            'cannot initialize SevenConnector without a options object',
        )

        console.log('options', options)

        this.client = new SevenClient(options.apiKey, 'LoopBack')
        this.DataAccessObject = new SevenDataAccessObject({connector: this})
    }
}
