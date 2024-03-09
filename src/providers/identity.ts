export interface Identity {
    id: string
    aud: string
    role: string
    email: string
    email_confirmed_at: string
    phone: string
    confirmation_sent_at: string
    confirmed_at: string
    recovery_sent_at: string
    last_sign_in_at: string
    app_metadata: AppMetadata
    user_metadata: UserMetadata
    identities: Identity[]
    created_at: string
    updated_at: string
    name: string
    color: string
    session: Session
}

export interface AppMetadata {
    provider: string
    providers: string[]
}

export interface UserMetadata {
    avatar_url: string
    custom_claims: CustomClaims
    email: string
    email_verified: boolean
    full_name: string
    iss: string
    name: string
    phone_verified: boolean
    picture: string
    preferred_username: string
    provider_id: string
    sub: string
    typecell_profile_nano_id: string
    typecell_username: string
    user_name: string
}

export interface CustomClaims {
    hd: string
}

export interface Identity {
    identity_id: string
    id: string
    user_id: string
    identity_data: IdentityData
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
    email: string
}

export interface IdentityData {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
    avatar_url?: string
    custom_claims?: CustomClaims2
    full_name?: string
    iss?: string
    name?: string
    picture?: string
    provider_id?: string
    preferred_username?: string
    user_name?: string
}

export interface CustomClaims2 {
    hd: string
}

export interface Session {
    access_token: string
    token_type: string
    expires_in: number
    expires_at: number
    refresh_token: string
    user: User
}

export interface User {
    id: string
    aud: string
    role: string
    email: string
    email_confirmed_at: string
    phone: string
    confirmation_sent_at: string
    confirmed_at: string
    recovery_sent_at: string
    last_sign_in_at: string
    app_metadata: AppMetadata2
    user_metadata: UserMetadata2
    identities: Identity2[]
    created_at: string
    updated_at: string
}

export interface AppMetadata2 {
    provider: string
    providers: string[]
}

export interface UserMetadata2 {
    avatar_url: string
    custom_claims: CustomClaims3
    email: string
    email_verified: boolean
    full_name: string
    iss: string
    name: string
    phone_verified: boolean
    picture: string
    preferred_username: string
    provider_id: string
    sub: string
    typecell_profile_nano_id: string
    typecell_username: string
    user_name: string
}

export interface CustomClaims3 {
    hd: string
}

export interface Identity2 {
    identity_id: string
    id: string
    user_id: string
    identity_data: IdentityData2
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
    email: string
}

export interface IdentityData2 {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
    avatar_url?: string
    custom_claims?: CustomClaims4
    full_name?: string
    iss?: string
    name?: string
    picture?: string
    provider_id?: string
    preferred_username?: string
    user_name?: string
}

export interface CustomClaims4 {
    hd: string
}
