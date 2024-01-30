import { AxiosRequestConfig } from 'axios';
import { axiosAPI } from ".";
import { IComponent } from "../ds";
import { components, draft_medicine } from './MockData';

export type Response = {
    draft_medicine: string | null;
    components: IComponent[];
}

export async function getAllComponents(filter?: string): Promise<Response> {
    let url = 'components';
    if (filter !== undefined) {
        url += `?name=${filter}`;
    }
    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(filter))
}

export async function getComponent(componentId?: string): Promise<IComponent | undefined> {
    if (componentId === undefined) {
        return undefined
    }
    let url = 'components/' + componentId
    return axiosAPI.get<IComponent>(url)
        .then(response => response.data)
        .catch(_ => components.get(componentId))
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