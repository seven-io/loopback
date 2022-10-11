import assert from 'assert'
import {DataSource, MessageOptions} from './types'

export class SevenDataAccessObject {
    dataSource: DataSource
    name = 'SevenDAO'
    send: (options: MessageOptions) => void

    constructor(parentContext: DataSource) {
        this.dataSource = parentContext

        this.send = (options: MessageOptions) => {
            assert(this.dataSource !== undefined, 'datasource cannot be undefined!')

            assert(this.dataSource.connector, 'cannot use this module without a connector!')

            options.json = true

            switch (options.operation) {
                case 'sms':
                    return this.dataSource.connector.client.sms(options)
                case 'voice':
                    return this.dataSource.connector.client.voice(options)
                default:
                    assert(false, `seven message of type ${options.operation} is not supported`)
            }
        }
    }
}
