import { components } from './MockData';
import { IComponentProps } from '../components/ComponentCard';

const api = '/api/components/'

export async function getComponent(componentId?: string): Promise<IComponentProps | undefined> {
    if (componentId === undefined) {
        return undefined
    }
    let url = api + componentId
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return components.get(componentId)
            }
            return response.json() as Promise<IComponentProps | undefined>
        })
        .catch(_ => {
            return components.get(componentId)
        })
}