import {SevenConnector} from './SevenConnector'

export type DataSource = {
    [k: string]: unknown
    connector: SevenConnector
}

export type MessageOptions = {
    from?: string
    operation: 'sms' | 'voice'
    text: string
    to: string
}

export type SevenConnectorOptions = {
    apiKey: string
}
