import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { setAlert } from '../redux/alertSlice';
import axios from 'axios';
import '../assets/Task.css'

const Task = (props) => {

    const dispatch = useDispatch();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEditClick = () => {
        if (props.isEditing) {
            // Fecha o modo de edição
            props.setEditingTaskId(null);
        } else {
            // Abre o modo de edição para esta tarefa
            props.setEditingTaskId(props.id);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
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

    // handle functions
    const handleFormChange = (ev) => {
        setForm({
            ...form,
            [ev.target.name]: ev.target.value
        });
    };

    const handleUpdateTask = async () => {

        // Data atual sem horas (para comparar apenas a data)
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const userDeadline = new Date(form.deadline);
        userDeadline.setHours(userDeadline.getHours() + 3); //+3 pela diferença dos fusos horários de São Paulo para Greenwich e não dar erro
        userDeadline.setHours(0, 0, 0, 0);

        // Validação da data limite
        if (userDeadline < currentDate) {
            dispatch(setAlert({ message: 'A data limite não pode ser anterior à data atual' }));
            return;
        }

        const adjustedDeadline = new Date(form.deadline);
        adjustedDeadline.setHours(adjustedDeadline.getHours() + 3); //+3 pela diferença dos fusos horários de São Paulo para Greenwich e não dar erro

        try {
            await axios.patch(`http://localhost:5000/${props.id}`, {
                name: form.name,
                cost: form.cost,
                deadline: adjustedDeadline
            });

            props.setTasks(prevTasks => prevTasks.map(task => 
                task.id === props.id ? { ...task, ...form, deadline: adjustedDeadline } : task
            ));

        } catch (err) {
            if (err.response.status === 500) {
                dispatch(setAlert({ message: 'Já existe uma tarefa com este nome, escolha outro' }));
            } else {
                dispatch(setAlert({ message: 'Erro ao atualizar tarefa' }));
            }
            console.error('Erro ao atualizar tarefa:', err);
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
                currentId: props.id,
                targetId: nextTask.id
            });
    
            // Atualizar o estado global
            props.setTasks(updatedTasks.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Erro ao mover tarefa para baixo:', error);
        }
    };

    return(
        <>
            <Container data-aos='fade-up' data-aos-anchor-placement="top-bottom" data-aos-duration="1200" className='w-75 d-flex align-items-center gap-1'>
                <Col xs={9}>
                    <Col ref={setNodeRef} style={style} {...attributes} {...listeners}
                        className={`fs-5 mt-3 py-4 d-flex justify-content-evenly border border-2 border-black rounded-start-4 ${moreThan1000() ? "bg-warning" : "bg-white"}`}
                    >
                            <span>{props.name}</span>
                            <span>{cost}</span>
                            <span>{deadline}</span>
                    </Col>
                </Col>

                <Col xs={3} data-aos='fade-up' data-aos-anchor-placement="top-bottom" data-aos-duration="1200"
                    className={`mt-3 px-3 py-3 fs-4 d-flex align-items-center border border-2 border-black rounded-end-4 ${moreThan1000() ? "bg-warning" : "bg-white"}`}
                >
                    <Col xs={9}>
                        <Button onClick={handleEditClick} className='me-3 btn-blue'><i className="bi bi-pencil-square fs-5" /></Button>
                        <Button onClick={() => setShowDeleteModal(true)} className='btn-red'><i className="bi bi-x-square fs-5" /></Button>
                    </Col>
                    <Col className='d-flex justify-content-end' xs={3}>
                        {props.tasks.findIndex(task => task.id === props.id) !== 0 && (
                            <span onClick={handleMoveUp}><i className="bi bi-arrow-up-short fs-3"></i></span>
                        )}
                        {props.tasks.findIndex(task => task.id === props.id) !== props.tasks.length - 1 ?
                            <span onClick={handleMoveDown}><i className="bi bi-arrow-down-short fs-3"></i></span>
                            :
                            <span style={{ width: '28px' }}></span>
                        }
                    </Col>
                </Col>
            </Container>
        
            <Container
                className={`border border-2 border-black rounded-4 w-75 ${props.isEditing ? 'edit-true' : 'edit-false'} ${moreThan1000() ? "bg-warning" : "bg-white"}`}
            >
                <h4 className='fw-bold pt-1 d-flex justify-content-center'>Editar Tarefa</h4>
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
                        <Button className='btn-green' onClick={handleUpdateTask}>
                            <i className="bi bi-plus-square fs-5" />
                        </Button>
                    </Col>
                    
                    <Col className='d-flex justify-content-start'>
                        <Button className='btn-secondary' onClick={() => props.setEditingTaskId(null)}>
                            <i class="bi bi-arrow-return-right fs-5"></i>
                        </Button>
                    </Col>
                </Row> 
            </Container>   

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação de Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza de que deseja excluir a tarefa "{props.name}"?</p>
                </Modal.Body>
                <Modal.Footer className='gap-2'>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <i class="bi bi-arrow-return-right fs-5"></i>
                    </Button>
                    <Button className='btn-red' onClick={handleDeleteTask}>
                        <i class="bi bi-check-lg fs-5"></i>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Task;