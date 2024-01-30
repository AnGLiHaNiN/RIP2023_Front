import axios from 'axios';

const ip = 'localhost'
const port = '3000'
export const imagePlaceholder = `${import.meta.env.BASE_URL}placeholder.jpg`

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 2000 });

export {getAllComponents, getComponent} from './Components'
export {getMedicines, getMedicine} from './Medicines'