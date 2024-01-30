import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from '../api';
import { getMedicines } from '../api';
import { IMedicine, MODERATOR } from '../ds';
import { AppDispatch, RootState } from "../store";
import { setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import LoadAnimation from '../components/LoadAnimation';
import DateTimePicker from '../components/DatePicker';

const AllMedicines = () => {
    const [medicines, setMedicines] = useState<IMedicine[]>([])
    const userFilter = useSelector((state: RootState) => state.search.user);
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const [loaded, setLoaded] = useState(false)
    const [prevFilter, setPrevFilter] = useState({
        userFilter,
        statusFilter,
        startDate,
        endDate
    })

    const getData = () => {
        getMedicines(prevFilter.userFilter, prevFilter.statusFilter, prevFilter.startDate, prevFilter.endDate)
            .then((data) => {
                setLoaded(true);
                setMedicines(data);
            })
            .catch(() => {
                setLoaded(true);
                setMedicines([])
            })
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setLoaded(false)
        setPrevFilter({
            userFilter,
            statusFilter,
            startDate,
            endDate
        })
    }

    useEffect(() => {
        getData()
        const intervalId = setInterval(() => {
            getData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dispatch, prevFilter]);

    const moderator_confirm = (id: string, confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/medicines/${id}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => setMedicines(medicines => medicines))
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                    {role == MODERATOR && <>
                        <Form.Label className='text-nowrap'>Пользователь:</Form.Label>
                        <Form.Control
                            size='sm'
                            value={userFilter}
                            className='shadow-sm'
                            onChange={(e) => dispatch(setUser(e.target.value))} />
                    </>}
                    <Form.Label >Статус:</Form.Label>
                    <Form.Select
                        defaultValue={statusFilter}
                        size='sm'
                        className='shadow-sm'
                        onChange={(status) => dispatch(setStatus(status.target.value))}>
                        <option value="">Любой</option>
                        <option value="сформирована">Сформирована</option>
                        <option value="завершена">Завершена</option>
                        <option value="отклонена">Отклонена</option>
                    </Form.Select>
                    <DateTimePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date ? date.toISOString() : null))}
                    />
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? date.toISOString() : null))}
                    />
                    <Button
                        variant="dark"
                        size="sm"
                        type="submit"
                        className="shadow-sm">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            {loaded ? (
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Создатель</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Статус проверки</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine.uuid}>
                                {role == MODERATOR && <td className='text-center'>{medicine.customer}</td>}
                                <td className='text-center'>{medicine.status}</td>
                                <td className='text-center'>{medicine.verification_status}</td>
                                <td className='text-center'>{medicine.creation_date}</td>
                                <td className='text-center'>{medicine.formation_date}</td>
                                <td className='text-center'>{medicine.completion_date}</td>
                                <td className='p-0 text-center align-middle'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`/medicines/${medicine.uuid}`}
                                                        className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                            {medicine.status == 'сформирован' && role == MODERATOR && <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <ButtonGroup className='flex-grow-1 w-100'>
                                                        <Button variant='outline-success' size='sm' onClick={moderator_confirm(medicine.uuid, true)}>✓</Button>
                                                        <Button variant='outline-danger' size='sm' onClick={moderator_confirm(medicine.uuid, false)}>🞪</Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>}
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

export default AllMedicines
