export interface IMedicine {
    uuid: string
    status: string
    creation_date: string
    formation_date: string | null
    completion_date: string | null
    customer: string
    moderator: string | null
    medicine_name: string | null
    verification_status: string | null
}

export interface IComponent {
    uuid: string
    name: string
    world_name: string
    amount: number
    properties: string
    image_url: string
}

export const NOTAUTHORIZED = 0;
export const CUSTOMER = 1;
export const MODERATOR = 2;