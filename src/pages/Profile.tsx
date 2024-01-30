import { FC, useEffect, useState, ChangeEvent } from 'react';
import { Card, Container, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from '../api'
import { IUser } from '../ds';

import LoadAnimation from '../components/LoadAnimation';

const Profile: FC = () => {
    const [user, setUser] = useState<IUser | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPassword2, setNewPassword2] = useState<string>('')

    const getData = async () => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const data = await axiosAPI.get<IUser>(`/user`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(response => response.data);
            setUser(data)
        } finally {
            setLoaded(true)
        }
    }
    useEffect(() => {
        getData();
    }, []);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        console.log({ [e.target.id]: e.target.value })
        setUser(user ? { ...user, [e.target.id]: e.target.value } : undefined)
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const accessToken = localStorage.getItem('access_token');
        
        if (newPassword != newPassword2) {
            alert("Пароли должны совпадать")
            return
        }
        setEdit(false);

        const request = {
            ...(user && user.name && { name: user.name }),
            ...(user && user.email && { email: user.email }),
            ...(newPassword && { password: newPassword }),
        };

        axiosAPI.put(`/user`, request, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData());
    }

    const cancel = () => {
        setEdit(false);
        getData();
        setNewPassword('');
        setNewPassword2('');
    }

    return loaded ? (
        user && (
            <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
                <Card className='shadow col col-12 col-sm-8 col-md-6'>
                    <Form onSubmit={save} className='p-0'>
                        <Card.Body className='flex-grow-1'>
                        <Card.Title className='text-center mb-4'>Профиль</Card.Title>
                            <Form.Group className='mb-1'>
                                <Form.Label>Логин</Form.Label>
                                <Form.Control value={user.login} readOnly />
                            </Form.Group>
                            <Form.Group className='mb-1'>
                                <Form.Label>ФИО</Form.Label>
                                <Form.Control id='name' value={user.name ? user.name : ''} readOnly={!edit} onChange={changeString} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Почта</Form.Label>
                                <Form.Control id='email' type='email' value={user.email ? user.email : ''} readOnly={!edit} onChange={changeString} />
                            </Form.Group>
                            <Form.Group className='mb-1'>
                                <Form.Label>Новый пароль</Form.Label>
                                <Form.Control type='password' value={newPassword} readOnly={!edit} onChange={(e) => setNewPassword(e.target.value)} />
                            </Form.Group>
                            {edit && <Form.Group className='mb-1'>
                                <Form.Label>Повторите пароль</Form.Label>
                                <Form.Control type='password' value={newPassword2} readOnly={!edit} onChange={(e) => setNewPassword2(e.target.value)} />
                            </Form.Group>}
                        </Card.Body>
                        {edit ? (
                            <ButtonGroup className='w-100'>
                                <Button variant='success' type='submit'>Сохранить</Button>
                                <Button variant='danger' onClick={cancel}>Отменить</Button>
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
            </Container >)
    ) : (
        <LoadAnimation />
    )
}

export default Profile