import {URIAssociation} from "../../URIAssociation";

export interface Playbook {
    name: string
    description: string
    version: string
    keywords: string
    license: string
    author: string
    settings: Settings
    dependencies: Dependency[]
    tasks: any[]
}

export interface Settings {
    language: string
    theme: Theme
    applications: Applications
    uriAssociation: URIAssociation
}

export interface Theme {
    mode: string
    fontFamily: string
}

export interface Applications {
    indexer: Indexer
}

export interface Indexer {
    redirect_policy: string
}

export interface UriAssociation {
    name: string
    pattern: string
    meta: Meta
    servicePreferenceOrder: string[]
}

export interface Meta {
    icon: string
}

export interface Dependency {
    uri: string
    integrity: string
    headers: Headers
    environment: string
    triggers: string[]
    data?: any
}

export interface Headers {}