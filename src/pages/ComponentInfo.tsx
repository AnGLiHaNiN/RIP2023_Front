import { FC, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import LoadAnimation from '../components/LoadAnimation';
import { getComponent } from '../api';
import { IComponent } from '../ds';
import CardImage from '../components/CardImage';

const ComponentInfo: FC = () => {
    let { component_id } = useParams()
    const [component, setComponent] = useState<IComponent>()
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getComponent(component_id)
            .then(data => {
                setComponent(data)
                setLoaded(true)
            })
    }, []);

    return (
        <>
            <Navbar>
                <Nav>
                    <Link to="/components" className="nav-link p-0 text-dark" data-bs-theme="dark">
                        Компоненты
                    </Link>
                    <Nav.Item className='mx-1'>{">"}</Nav.Item>
                    <Nav.Item className="nav-link p-0 text-dark">
                        {`${component ? component.name : 'неизвестно'}`}
                    </Nav.Item>
                </Nav>
            </Navbar>
            {loaded ? (
                component ? (
                    <Container className='d-flex justify-content-center mb-1'>
                        <Card className='shadow text-md-start' style={{ maxWidth: '440px' }}>
                            <Card.Body>
                                <div className='overflow-hidden'>
                                    <CardImage url={component.image_url} />
                                </div>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Card.Title>{component.name}</Card.Title>
                                        <Card.Text>Международное наименование: {component.world_name}</Card.Text>
                                        <Card.Text>Количество: {component.amount}</Card.Text>
                                        <Card.Text>Свойства: {component.properties}</Card.Text>
                                    </ListGroup.Item>
                                </ListGroup>
                                <Link to={`/components`} className="btn btn-dark w-50 mx-auto d-block">Назад</Link>
                            </Card.Body>
                        </Card>
                    </Container>
                ) : (
                    <h3 className='text-center'>Такого компонента не существует</h3>
                )
            ) : (
                <LoadAnimation />
            )
            }
        </>
    )
}

export default ComponentInfo