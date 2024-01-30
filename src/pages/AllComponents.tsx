import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getAllComponents, axiosAPI } from '../api'
import { IComponent, NOTAUTHORIZED } from '../ds';
import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import ComponentCard from '../components/ComponentCard';
import LoadAnimation from '../components/LoadAnimation';

const AllComponents = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [components, setComponents] = useState<IComponent[]>([]);
    const nameFilter = useSelector((state: RootState) => state.search.name);
    const [draft, setDraft] = useState<string | null>(null)
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();

    const getComponents = () => {
        getAllComponents(nameFilter)
            .then(data => {
                setComponents(data.components)
                setDraft(data.draft_medicine)
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

    const addToMedicine = (id: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.post(`/components/${id}/add_to_medicine`, null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => {
                getComponents();
            })
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
                    {role != NOTAUTHORIZED &&
                        <Link to={`/medicines/${draft}`} className={draft == null ? 'disabled-link' : ''}>
                            <Button
                                size='sm'
                                variant='outline-primary'
                                className="shadow"
                                disabled={draft == null}>
                                Черновик
                            </Button>
                        </Link>
                    }
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                {loaded ? (
                    components.map((component) => (
                        <div className='d-flex py-1 p-2 justify-content-center' key={component.uuid}>
                            <ComponentCard {...component}>
                                {role != 0 &&
                                    <>
                                        <Link to={`/components/${component.uuid}`} className="btn btn-dark">Подробнее</Link>
                                        <Button
                                            variant='success'
                                            className='mt-0 rounded-bottom'
                                            onClick={addToMedicine(component.uuid)}>
                                            Добавить в лекарство
                                        </Button>
                                    </>
                                }
                            </ComponentCard>

                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )}
            </div>
        </>
    )
}

export default AllComponents