import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { axiosAPI, getAllComponents } from '../api'
import { IComponent } from '../ds';

import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';


const ComponentsTable = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [components, setComponents] = useState<IComponent[]>([]);
    const nameFilter = useSelector((state: RootState) => state.search.name);
    const dispatch = useDispatch<AppDispatch>();

    const getComponents = () => {
        getAllComponents(nameFilter)
            .then(data => {
                setComponents(data.components)
                setLoaded(true)
            })
    }

    useEffect(() => {
        getComponents();
    }, []);

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setLoaded(false)
        getComponents();
    }

    const deleteComponent = (uuid: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/components/${uuid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getComponents())
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Label className='text-nowrap'>Введите название:</Form.Label>
                    <Form.Control
                        type="text"
                        className="form-control-sm flex-grow-1 shadow shadow-sm"
                        value={nameFilter}
                        onChange={(e) => dispatch(setName(e.target.value))}
                    />
                    <Button
                        variant="dark"
                        size="sm"
                        type="submit"
                        className="shadow">
                        Поиск
                    </Button>
                    <Link to='new' className='btn btn-sm btn-success shadow'>Создать</Link>
                </Form>
            </Navbar>
            {loaded ? (
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'>Изображение</th>
                            <th className='text-center'>Название</th>
                            <th className='text-center'>Международное название</th>
                            <th className='text-center'>Количество</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {components.map((component) => (
                            <tr key={component.uuid}>
                                <td style={{ width: '18%' }} className='p-0'>
                                    <CardImage url={component.image_url} />
                                </td>
                                <td className='text-center'>{component.name}</td>
                                <td className='text-center'>{component.world_name}</td>
                                <td className='text-center'>{component.amount} мг</td>
                                <td className='text-center align-middle p-0'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link
                                                        to={`/components-edit/${component.uuid}`}
                                                        className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                        Редактировать
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        className='w-100'
                                                        onClick={deleteComponent(component.uuid)}>
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <LoadAnimation />
            )}
        </>
    )
}

export default ComponentsTable