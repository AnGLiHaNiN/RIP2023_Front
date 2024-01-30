import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { useDispatch } from "react-redux";
import { Card, Navbar, Container, Form, Col, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI, getComponent } from '../api'
import { IComponent } from '../ds';

import { AppDispatch } from "../store";

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';

const ComponentEdit: FC = () => {
    let { component_id } = useParams()
    const [component, setComponent] = useState<IComponent | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const [edit, setEdit] = useState<boolean>(false)
    const [image, setImage] = useState<File | undefined>(undefined);
    const inputFile = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: IComponent | undefined;
            try {
                if (component_id == 'new') {
                    data = {
                        uuid: "",
                        name: "",
                        world_name: "",
                        image_url: "",
                        amount: NaN,
                        properties: "",
                    };
                    setEdit(true);
                } else {
                    data = await getComponent(component_id);
                }
                setComponent(data);
            } finally {
                setLoaded(true);
            }
        }

        getData();

    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setComponent(component ? { ...component, [e.target.id]: e.target.value } : undefined)
    }

    const changeNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setComponent(component ? { ...component, [e.target.id]: parseInt(e.target.value) } : undefined)
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const accessToken = localStorage.getItem('access_token');
        setEdit(false);

        console.log(component)

        const formData = new FormData();
        if (component) {
            Object.keys(component).forEach(key => {
                if ((component as any)[key]) {
                    formData.append(key, (component as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (component_id == 'new') {
            axiosAPI.post(`/components`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then((response) => getComponent(response.data).then((data) => {
                    setComponent(data)
                    component_id = data?.uuid
                }))
        } else {
            axiosAPI.put(`/components/${component?.uuid}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getComponent(component_id).then((data) => setComponent(data)))
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getComponent(component_id)
            .then((data) => setComponent(data))
    }

    return loaded ? (
        component ? (
            <>
                <Navbar>
                    <Nav>
                        <Link to="/components-edit" className="nav-link p-0 text-dark" data-bs-theme="dark">
                            Таблица компонентов
                        </Link>
                        <Nav.Item className='mx-1'>{">"}</Nav.Item>
                        <Nav.Item className="nav-link p-0 text-dark">
                            {`${component ? component.name : 'неизвестно'}`}
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Container className='d-flex justify-content-center mb-1'>
                    <Card className='shadow' style={{ maxWidth: '440px' }}>
                        <Form onSubmit={save} className='p-0'>
                            <Card.Body className='flex-grow-1'>
                                <Col className='overflow-hidden p-0'>
                                    <CardImage url={component.image_url} />
                                </Col>
                                <Form.Group className='mb-1'>
                                    <Form.Label>Название</Form.Label>
                                    <Form.Control id='name' value={component.name} readOnly={!edit} onChange={changeString} />
                                </Form.Group>
                                <Form.Group className='mb-1'>
                                    <Form.Label>Международное название</Form.Label>
                                    <Form.Control id='world_name' value={component.world_name} readOnly={!edit} onChange={changeString} />
                                </Form.Group>
                                <Form.Group className='mb-1'>
                                    <Form.Label >Количество</Form.Label>
                                    <Form.Control id='amount' type='number' value={isNaN(component.amount) ? '' : component.amount} readOnly={!edit} onChange={changeNumber} />
                                </Form.Group>
                                <Form.Group className="mb-3 flex-grow-1">
                                    <Form.Label>Свойства</Form.Label>
                                    <Form.Control
                                        id='properties'
                                        value={component.properties}
                                        as="textarea"
                                        rows={3}
                                        readOnly={!edit}
                                        onChange={changeString} />
                                </Form.Group>
                                <Form.Group className="mb-1">
                                    <Form.Label>Выберите изображение</Form.Label>
                                    <Form.Control
                                        disabled={!edit}
                                        type="file"
                                        accept='image/*'
                                        ref={inputFile}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                </Form.Group>
                            </Card.Body>
                            {edit ? (
                                <ButtonGroup className='w-100'>
                                    <Button variant='success' type='submit'>Сохранить</Button>
                                    {component_id != 'new' && <Button variant='danger' onClick={cancel}>Отменить</Button>}
                                </ButtonGroup>
                            ) : (
                                <Button
                                    onClick={() => setEdit(true)}
                                    variant='dark'
                                    className='w-100'>
                                    Изменить
                                </Button>
                            )}
                        </Form>
                    </Card>
                </Container >
            </ >
        ) : (
            <h3 className='text-center'>Такого компонента не существует</h3>
        )
    ) : (
        <LoadAnimation />
    )

}

export default ComponentEdit