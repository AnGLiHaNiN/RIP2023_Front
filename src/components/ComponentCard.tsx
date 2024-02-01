import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardImage from './CardImage';

export interface IComponentProps {
    uuid: string
    name: string
    world_name: string
    amount: number
    properties: string
    image_url: string
}

const ComponentCard: FC<IComponentProps> = ({ uuid, name, world_name, image_url }) => (
    <Card className='card text-center'>
        <CardImage url={image_url} className='rounded object-fit-cover p-2' />
        <Card.Body className='d-flex flex-column flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{world_name}</Card.Text>
            <div className='flex-grow-1'></div>
            <Link to={`/components/${uuid}`} className="btn btn-dark w-100">Подробнее</Link>
        </Card.Body>
    </Card>
)

export default ComponentCard