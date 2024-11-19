import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import '../assets/Task.css'

const Task = (props) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editClicked, setIsEditClicked] = useState(false);
    const [form, setForm] = useState({
        name: props.name,
        cost: props.cost,
        deadline: new Date(props.deadline).toISOString().split('T')[0]
    })

    const deadline = new Date(props.deadline).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const cost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(props.cost);

    const moreThan1000 = () => {
        return props.cost >= 1000;
    };

    const handleFormChange = (ev) => {
        setForm({
            ...form,
            [ev.target.name]: ev.target.value
        });
    };

    const handleUpdateTask = async () => {
        try {
            await axios.patch(`http://localhost:5000/${props.id}`, {
                name: form.name,
                cost: form.cost,
                deadline: form.deadline
            });

            props.setTasks(prevTasks => prevTasks.map(task => 
                task.id === props.id ? { ...task, ...form } : task
            ));

            setIsEditClicked(false);
        } catch (error) {
            console.error('Erro ao atualizar a tarefa:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`http://localhost:5000/${props.id}`);
            
            props.setTasks(prevTasks => prevTasks.filter(task => task.id !== props.id));

            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
        }
    };

    const handleMoveUp = async () => {
        try{
            // Encontrando a tarefa anterior
            const currentIndex = props.tasks.findIndex(task => task.id === props.id);
            const previousTask = props.tasks[currentIndex - 1];

            // Trocando os valores de ordem localmente
            const updatedTasks = [...props.tasks];
            updatedTasks[currentIndex].order = previousTask.order;
            updatedTasks[currentIndex - 1].order = props.order;

            // Atualizar no backend
            await axios.patch('http://localhost:5000/updateOrder', {
                currentId: props.id,
                targetId: previousTask.id
            });

            // Atualizar o estado global
            props.setTasks(updatedTasks.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Erro ao mover a tarefa para cima: ' + error);
        }
    }

    const handleMoveDown = async () => {
        try {
            // Encontre a próxima tarefa
            const currentIndex = props.tasks.findIndex(task => task.id === props.id);
            const nextTask = props.tasks[currentIndex + 1];
            
            // Trocar os valores de ordem localmente
            const updatedTasks = [...props.tasks];
            updatedTasks[currentIndex].order = nextTask.order;
            updatedTasks[currentIndex + 1].order = props.order;
    
            // Atualizar o backend
            await axios.patch('http://localhost:5000/updateOrder', {
                task1: { id: props.id, order: nextTask.order },
                task2: { id: nextTask.id, order: props.order },
            });
    
            // Atualizar o estado global
            props.setTasks(updatedTasks.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Erro ao mover tarefa para baixo:', error);
        }
    };

    return(
        <>
            <Container xs={9} className={`mt-3 py-3 w-75 fs-4 d-flex align-items-center ${moreThan1000() ? "bg-warning" : "container-task"}`}>
                <Col className='d-flex justify-content-evenly'>
                    <span>{props.name}</span>
                    <span>{cost}</span>
                    <span>{deadline}</span>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => setIsEditClicked(!editClicked)} className='me-3 btn-primary'><i className="bi bi-pencil-square fs-5" /></Button>
                    <Button onClick={() => setShowDeleteModal(true)} className='btn-danger'><i className="bi bi-x-square fs-5" /></Button>
                </Col>
                <Col className='d-flex justify-content-end' xs={1}>
                    {props.tasks.findIndex(task => task.id === props.id) !== 0 && (
                        <span onClick={handleMoveUp}><i className="bi bi-arrow-up-short fs-3"></i></span>
                    )}
                    {props.tasks.findIndex(task => task.id === props.id) !== props.tasks.length - 1 ?
                        <span onClick={handleMoveDown}><i className="bi bi-arrow-down-short fs-3"></i></span>
                        :
                        <span style={{ width: '28px' }}></span>
                    }
                </Col>
            </Container>
        
            {editClicked && (
                <Container className={`w-75 ${moreThan1000() ? "bg-warning" : "container-task"}`}>
                    <hr />
                    <Form.Group className='mt-4 mb-2 d-flex flex-row'>
                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Nome</Form.Label>
                            <Form.Control type='text' name='name' value={form.name} onChange={handleFormChange} />
                        </Col>

                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Custo</Form.Label>
                            <Form.Control type='number' name='cost' value={form.cost} onChange={handleFormChange} />
                        </Col>

                        <Col xs={4} className='px-2'>
                            <Form.Label className='fw-bold'>Data Limite</Form.Label>
                            <Form.Control type='date' name='deadline' value={form.deadline} onChange={handleFormChange} />
                        </Col>
                    </Form.Group>

                    <Row className='pt-1 pb-2'>
                        <Col className='d-flex justify-content-end'>
                            <Button className='btn-success' onClick={handleUpdateTask}>
                                <i className="bi bi-plus-square fs-5" />
                            </Button>
                        </Col>
                        
                        <Col className='d-flex justify-content-start'>
                            <Button className='btn-danger' onClick={() => setIsEditClicked(false)}>
                                <i className="bi bi-x-square fs-5" />
                            </Button>
                        </Col>
                    </Row> 
                </Container>   
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação de Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza de que deseja excluir a tarefa "{props.name}"?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteTask}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Task;