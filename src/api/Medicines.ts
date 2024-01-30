import { format } from 'date-fns';

import { axiosAPI } from ".";
import { IComponent, IMedicine } from "../ds";

interface MedicinesResponse {
    medicines: IMedicine[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export async function getMedicines(
    user: string,
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<IMedicine[]> {
    const accessToken = localStorage.getItem('access_token');
    return axiosAPI
        .get<MedicinesResponse>('/medicines', {
            params: {
                ...(status && { status: status }),
                ...(startDate && {
                    formation_date_start: format(new Date(startDate), 'yyyy-MM-dd'),
                }),
                ...(endDate && {
                    formation_date_end: format(new Date(endDate), 'yyyy-MM-dd'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.data.medicines
            .filter((medicine: IMedicine) => medicine.customer.toLowerCase().includes(user.toLowerCase()))
            .map((medicine: IMedicine) => ({
                ...medicine,
                creation_date: formatDate(new Date(medicine.creation_date)),
                formation_date: medicine.formation_date
                    ? formatDate(new Date(medicine.formation_date))
                    : null,
                completion_date: medicine.completion_date
                    ? formatDate(new Date(medicine.completion_date))
                    : null,
            }))
        );
}

interface MedicineResponse {
    components: IComponent[]
    medicine: IMedicine
}

export async function getMedicine(id: string | undefined): Promise<MedicineResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');

    return axiosAPI.get<MedicineResponse>(`/medicines/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedMedicine: IMedicine = {
                ...response.data.medicine,
                creation_date: formatDate(new Date(response.data.medicine.creation_date)),
                formation_date: response.data.medicine.formation_date
                    ? formatDate(new Date(response.data.medicine.formation_date))
                    : null,
                completion_date: response.data.medicine.completion_date
                    ? formatDate(new Date(response.data.medicine.completion_date))
                    : null,
            };

            return {
                ...response.data,
                medicine: modifiedMedicine,
            };
        })
}