import assert from 'assert'
import fetch from 'node-fetch'
import {Client} from '@seven.io/client'
import {SevenDataAccessObject} from './SevenDataAccessObject'
import {DataSource, SevenConnectorOptions} from './types'

if (!globalThis.fetch) globalThis.fetch = fetch as unknown as typeof globalThis.fetch

export class SevenConnector {
    DataAccessObject: SevenDataAccessObject
    client: Client
    dataSource?: DataSource
    name = 'SevenConnector'

    constructor(public options: SevenConnectorOptions) {
        assert(
            typeof options === 'object',
            'cannot initialize SevenConnector without a options object',
        )

        this.client = new Client({apiKey: options.apiKey, sentWith: 'LoopBack'})
        this.DataAccessObject = new SevenDataAccessObject({connector: this})
    }
}
