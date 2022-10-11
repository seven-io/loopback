import assert from 'assert'
import fetch from 'node-fetch'
import Sms77Client from 'sms77-client'
import {SevenDataAccessObject} from './SevenDataAccessObject'
import {DataSource, SevenConnectorOptions} from './types'

if (!globalThis.fetch) globalThis.fetch = fetch as unknown as typeof globalThis.fetch

export class SevenConnector {
    DataAccessObject: SevenDataAccessObject
    client: Sms77Client
    dataSource?: DataSource
    name = 'SevenConnector'

    constructor(public options: SevenConnectorOptions) {
        assert(
            typeof options === 'object',
            'cannot initialize SevenConnector without a options object',
        )

        console.log('options', options)

        this.client = new Sms77Client(options.apiKey, 'LoopBack')
        this.DataAccessObject = new SevenDataAccessObject({connector: this})
    }
}
