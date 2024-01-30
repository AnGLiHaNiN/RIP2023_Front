import { FC, ReactNode } from 'react'
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CardImage from './CardImage';
import { IComponent } from '../ds';

interface ComponentCardProps extends IComponent {
    children: ReactNode;
}

const ComponentCard: FC<ComponentCardProps> = ({ children, name, world_name, image_url }) => (
    <Card className='card text-center shadow'>
        <CardImage url={image_url} className='rounded object-fit-cover p-2' />
        <Card.Body className='d-flex flex-column flex-grow-1'>
            <div className='flex-grow-1'></div>
            <Card.Title>{name}</Card.Title>
            <Card.Text className={children ? 'mb-2' : 'mb-0'}>{world_name}</Card.Text>
            <ButtonGroup vertical>
                <>{children}</>
            </ButtonGroup>
        </Card.Body>
    </Card>
)

export default ComponentCard