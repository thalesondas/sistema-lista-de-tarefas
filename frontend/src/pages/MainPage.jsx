import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import Task from '../components/Task';
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
        status: ''
    });

    const arrayMove = (array, fromIndex, toIndex) => {
        const newArray = [...array];
        const [movedItem] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, movedItem);
        return newArray;
    };

    const handleFormChange = (ev) => {
        setAddForm({
            ...addForm,
            [ev.target.name]: ev.target.value
        });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/', addForm);

            setTasks([...tasks, response.data]);

            setAddForm({
                name: '',
                cost: '',
                deadline: ''
            })

            setIsAddClicked(false);
        } catch (err) {
            console.error('Erro ao adicionar a tarefa:', err);
        }
    };

    // Drag and drop
    const handleDragEnd = async (ev) => {
        const { active, over } = ev;
    
        if (!over || active.id === over.id) return;
    
        // Reorganiza as tarefas no array
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.findIndex(task => task.id === over.id);
        const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
    
        // Atualiza as ordens localmente
        const reorderedTasks = updatedTasks.map((task, index) => ({
            ...task,
            order: index + 1 // Ordem começa em 1
        }));
    
        setTasks(reorderedTasks);
    
        // Envia a lista atualizada para o backend
        try {
            await axios.post('http://localhost:5000/updateOrderDragAndDrop', reorderedTasks);
        } catch (error) {
            console.error('Erro ao atualizar as ordens no backend:', error);
        }
    };

    return(
        <Container className='container-base d-flex flex-column justify-content-start align-items-center'>
            <h1 className='py-4'>Desafio FATTO</h1>
            <h2 className='pb-2'>Lista de Tarefas</h2>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task, index) => (
                        <Task
                            index={index}
                            key={task.id}
                            id={task.id}
                            name={task.name}
                            cost={task.cost}
                            deadline={task.deadline}
                            order={task.order}
                            tasks={tasks}
                            setTasks={setTasks}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {isAddClicked ? 
            
                <Container className='mb-5 mt-4 w-75 bg-white'>

                    <h4 className='mt-2 d-flex justify-content-center'>Adicionar Nova Tarefa</h4>

                    <Form.Group className='my-2 d-flex flex-row' onSubmit={handleSubmit}>
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
                            <Button className='btn-success' onClick={handleSubmit}>
                                <i className="bi bi-plus-square fs-5" />
                            </Button>
                        </Col>
                        
                        <Col className='d-flex justify-content-start'>
                            <Button className='btn-secondary' onClick={() => setIsAddClicked(false)}>
                                <i className="bi bi-x-square fs-5" />
                            </Button>
                        </Col>
                    </Row>

                </Container>
                :
                <Button className='btn-success w-25 py-2 mt-4 mb-5' onClick={() => setIsAddClicked(true)}>
                    <i className="bi bi-plus-square fs-4"></i>
                </Button>
            }
        </Container>
    )
}

export default MainPage;