import assert from 'assert'
import {DataSource, MessageOptions} from './types'
import {RcsResource, SmsResource, VoiceResource} from '@seven.io/client'

export class SevenDataAccessObject {
    dataSource: DataSource
    name = 'SevenDAO'
    send: (options: MessageOptions) => void

    constructor(parentContext: DataSource) {
        this.dataSource = parentContext

        this.send = (options: MessageOptions) => {
            assert(this.dataSource !== undefined, 'datasource cannot be undefined!')

            assert(this.dataSource.connector, 'cannot use this module without a connector!')

            switch (options.operation) {
                case 'rcs':
                    const resource = new RcsResource(this.dataSource.connector.client)
                    return resource.dispatch({
                        from: options.from,
                        text: options.text,
                        to: options.to,
                    })
                case 'sms':
                    const smsResource = new SmsResource(this.dataSource.connector.client)
                    return smsResource.dispatch({
                        from: options.from,
                        text: options.text,
                        to: options.to.split(','),
                    })
                case 'voice':
                    const voiceResource = new VoiceResource(this.dataSource.connector.client)
                    return voiceResource.dispatch({
                        from: options.from,
                        text: options.text,
                        to: options.to,
                    })
                default:
                    assert(false, `seven message of type ${options.operation} is not supported`)
            }
        }
    }
}
