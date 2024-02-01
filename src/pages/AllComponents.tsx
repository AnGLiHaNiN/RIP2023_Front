import { useEffect, useState } from 'react';
import ComponentCard, { IComponentProps } from '../components/ComponentCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getAllComponents } from '../requests/GetAllComponents'


const AllComponents = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [components, setComponents] = useState<IComponentProps[]>([]);
    const [nameFilter, setNameFilter] = useState<string>('');


    useEffect(() => {
        getAllComponents()
            .then(data => {
                setComponents(data.components);
                setLoaded(true);
            })
    }, []);

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setLoaded(false);
        getAllComponents(nameFilter)
            .then(data => {
                setComponents(data.components);
                setLoaded(true);
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
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <Button
                        variant="dark"
                        size="sm"
                        type="submit"
                        className="shadow">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                {loaded ? (
                    components.map((component) => (
                        <div className='d-flex py-1 p-2 justify-content-center' key={component.uuid}>
                            <ComponentCard {...component} />
                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )}
            </div>
        </>
    )
}

export { AllComponents }