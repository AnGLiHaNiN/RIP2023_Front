import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup, Nav } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getMedicine } from '../api';
import { IComponent, IMedicine } from '../ds';
import LoadAnimation from '../components/LoadAnimation';
import ContainerCard from '../components/ComponentCard';

const MedicineInfo = () => {
    let { medicine_id } = useParams()
    const [medicine, setMedicine] = useState<IMedicine | null>(null)
    const [components, setComponents] = useState<IComponent[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        getMedicine(medicine_id)
            .then(data => {
                if (data === null) {
                    setMedicine(null)
                    setComponents([])
                } else {
                    setMedicine(data.medicine);
                    setName(data.medicine.medicine_name ? data.medicine.medicine_name : '')
                    setComponents(data.components);
                }
            })
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/medicines`,
            { medicine_name: name },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => getData());
        setEdit(false);
    }

    useEffect(() => {
        getData();
        setLoaded(true);
    }, []);

    const delFromMedicine = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/medicines/delete_component/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put('/medicines/user_confirm', null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => getData())
    }

    const deleteT = () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.delete('/medicines', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => navigate('/components'))
    }

    console.log(medicine?.medicine_name)

    return loaded ? (
        medicine ? (
            <>
                <Navbar>
                    <Nav>
                        <Link to="/medicines" className="nav-link p-0 text-dark" data-bs-theme="dark">
                            Лекарства
                        </Link>
                        <Nav.Item className='mx-1'>{">"}</Nav.Item>
                        <Nav.Item className="nav-link p-0 text-dark">
                            {`${medicine.medicine_name !== null ? medicine.medicine_name : 'Новое лекарство'}`}
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Row className='p-3 px-lg-0 px-0 pt-1'>
                    <Col className='col-12 col-sm-6 col-lg-4'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <Form.Group className='mb-1'>
                                    <Form.Label>Статус</Form.Label>
                                    <Form.Control readOnly value={medicine.status} />
                                </Form.Group>
                                <Form.Group className='mb-1'>
                                    <Form.Label>Создана</Form.Label>
                                    <Form.Control readOnly value={medicine.creation_date} />
                                </Form.Group>
                                {medicine.status != 'черновик' && <Form.Group className='mb-1'>
                                    <Form.Label>Сформирована</Form.Label>
                                    <Form.Control readOnly value={medicine.formation_date ? medicine.formation_date : ''} />
                                </Form.Group>}
                                {(medicine.status == 'отклонена' || medicine.status == 'завершена') && <Form.Group className='mb-1'>
                                    <Form.Label className='m-input-group-text'>{medicine.status === 'отклонена' ? 'Отклонена' : 'Завершена'}</Form.Label>
                                    <Form.Control readOnly value={medicine.completion_date ? medicine.completion_date : ''} />
                                </Form.Group>}
                                <Form.Group className='mb-1'>
                                    <Form.Label className='m-input-group-text'>Название</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            readOnly={!edit}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {!edit && medicine.status === 'черновик' && <Button variant='secondary' onClick={() => setEdit(true)}>Изменить</Button>}
                                        {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                        {edit && <Button
                                            variant='danger'
                                            onClick={() => {
                                                setName(medicine.medicine_name ? medicine.medicine_name : '');
                                                setEdit(false)
                                            }}>
                                            Отменить
                                        </Button>}
                                    </InputGroup>
                                </Form.Group>
                                {medicine.status != 'черновик' &&
                                    <Form.Group className='mb-1'>
                                        <Form.Label className='m-input-group-text'>Статус проверки</Form.Label>
                                        <Form.Control readOnly value={medicine.verification_status ? medicine.verification_status : ''} />
                                    </Form.Group>
                                }
                                {medicine.status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100 mt-3'>
                                        <Button variant='success' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteT}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-12 col-sm-6 col-lg-8'>
                        {components && <Row className='row-cols-1 row-cols-lg-2 row-cols-xl-3 px-1 mt-0 mt-ms-2'>
                            {components.map((component) => (
                                <div className='d-flex p-2 justify-content-center' key={component.uuid}>
                                    <ContainerCard  {...component}>
                                        {medicine.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromMedicine(component.uuid)}>
                                                Удалить
                                            </Button>}
                                    </ContainerCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </Row >
            </>
        ) : (
            <h4 className='text-center'>Такого лекарства не существует</h4>
        )
    ) : (
        <LoadAnimation />
    )
}

export default MedicineInfo