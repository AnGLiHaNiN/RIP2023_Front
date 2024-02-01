import { components, draft_medicine } from './MockData';
import { IComponentProps } from '../components/ComponentCard';

export type Response = {
    draft_medicine: string | null;
    components: IComponentProps[];
}

export async function getAllComponents(filter?: string): Promise<Response> {
    let url = '/api/components'
    if (filter !== undefined) {
        url += `?name=${filter}`
    }
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return fromMock(filter)
            }
            return response.json() as Promise<Response>
        })
        .catch(_ => {
            return fromMock(filter)
        })
}

function fromMock(filter?: string): Response {
    let filteredComponents = Array.from(components.values())
    if (filter !== undefined) {
        let name = filter.toLowerCase()
        filteredComponents = filteredComponents.filter(
            (component) => component.name.toLowerCase().includes(name)
        )
    }
    return { draft_medicine, components: filteredComponents }
}