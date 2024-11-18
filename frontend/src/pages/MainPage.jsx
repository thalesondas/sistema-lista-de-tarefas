import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Task from '../components/Task';
import axios from 'axios';
import '../assets/MainPage.css';

const MainPage = () => {
    
    useEffect(() => {
        const fetchTasks = async() => {
            try{
                const response = await axios.get('http://localhost:5000/');
                setTasks(response.data);
            } catch(err){
                console.log(err);
            }
        }

        fetchTasks();
    }, []);

    const [isAddClicked, setIsAddClicked] = useState(false);
    const [tasks, setTasks] = useState([]);

    const [addForm, setAddForm] = useState({
        name: '',
        cost: '',
        deadline: '',
        order: ''
    });

    const handleFormChange = (ev) => {
        setAddForm({
            ...addForm,
            [ev.target.name]: ev.target.value
        });
    };

    return(
        <Container className='container-base d-flex flex-column justify-content-start align-items-center'>
            <h1 className='py-4'>Desafio FATTO</h1>
            <h2 className='pb-2'>Lista de Tarefas</h2>
            {tasks.map((task) => (
                <Task id={task.id} name={task.name} cost={task.cost} deadline={task.deadline}/>
            ))}

            {isAddClicked ? 
            
                <Container className='position-relative mt-4 w-75 bg-white'>

                    <h4 className='mt-2 d-flex justify-content-center'>Adicionar Nova Tarefa</h4>

                    <Form.Group className='my-2 d-flex flex-row'>
                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Nome</Form.Label>
                            <Form.Control type='text' name='name' value={addForm.name} onChange={handleFormChange} />
                        </Col>

                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Custo</Form.Label>
                            <Form.Control type='number' name='cost' value={addForm.cost} onChange={handleFormChange} />
                        </Col>

                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Data Limite</Form.Label>
                            <Form.Control type='date' name='deadline' value={addForm.deadline} onChange={handleFormChange} />
                        </Col>

                    </Form.Group>

                    <Row className='pt-1 pb-2'>
                        <Col className='d-flex justify-content-end'>
                            <Button className='btn-success'>
                                <i class="bi bi-plus-square fs-5" />
                            </Button>
                        </Col>
                        
                        <Col className='d-flex justify-content-start'>
                            <Button className='btn-danger' onClick={() => setIsAddClicked(false)}>
                                <i class="bi bi-x-square fs-5" />
                            </Button>
                        </Col>
                    </Row>

                </Container>
                :
                <Button className='btn-success w-25 py-2 mt-4' onClick={() => setIsAddClicked(true)}>
                    <i class="bi bi-plus-square fs-4"></i>
                </Button>
            }
        </Container>
    )
}

export default MainPage;