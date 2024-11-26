import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { setAlert } from '../redux/alertSlice';
import axios from 'axios';
import Task from '../components/Task';
import Logo from '../images/fatto-logo.png';
import '../assets/MainPage.css';
import Aos from 'aos';

const MainPage = () => {
    
    useEffect(() => {
        const fetchTasks = async() => {
            try{
                const response = await axios.get('http://localhost:3001/');
                setTasks(response.data);
            } catch(err){
                console.log(err);
            }
        }

        fetchTasks();
    }, []);

    const dispatch = useDispatch();

    const [isAddClicked, setIsAddClicked] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);

    const [addForm, setAddForm] = useState({
        name: '',
        cost: '',
        deadline: ''
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

        // Data atual sem horas (para comparar apenas a data)
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const userDeadline = new Date(addForm.deadline);
        userDeadline.setHours(userDeadline.getHours() + 3); //+3 pela diferença dos fusos horários de São Paulo para Greenwich e não dar erro
        userDeadline.setHours(0, 0, 0, 0);

        // Validação da data limite
        if (userDeadline < currentDate) {
            dispatch(setAlert({ message: 'A data limite não pode ser anterior à data atual' }));
            return;
        }

        const adjustedDeadline = new Date(addForm.deadline);
        adjustedDeadline.setHours(adjustedDeadline.getHours() + 3); //+3 pela diferença dos fusos horários de São Paulo para Greenwich e não dar erro

        try {
            const response = await axios.post('http://localhost:3001/', {
                ...addForm,
                deadline: adjustedDeadline
            });

            setTasks([...tasks, response.data]);

            setAddForm({
                name: '',
                cost: '',
                deadline: ''
            })

            setIsAddClicked(false);
        } catch (err) {
            if (err.response.status === 500) {
                dispatch(setAlert({ message: 'Já existe uma tarefa com este nome, escolha outro' }));
            } else {
                dispatch(setAlert({ message: 'Erro ao adicionar tarefa' }));
            }
            console.error('Erro ao adicionar tarefa:', err);
        }
    };

    // Drag and drop
    const handleDragEnd = async (ev) => {
        const { active, over } = ev;
    
        if (!over || active.id === over.id) return;
    
        // Encontra os índices das tarefas
        const oldIndex = tasks.findIndex(task => task._id === active.id);
        const newIndex = tasks.findIndex(task => task._id === over.id);
        
        // Reorganiza as tarefas no array
        const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
    
        // Atualiza a ordem localmente
        const reorderedTasks = updatedTasks.map((task, index) => ({
            ...task,
            order: index + 1 // A ordem começa em 1 (ou outro valor, se necessário)
        }));
    
        // Atualiza o estado com a nova ordem
        setTasks(reorderedTasks);
    
        // Envia a lista de tarefas com a nova ordem para o backend
        try {
            await axios.post('http://localhost:3001/updateOrderDragAndDrop', reorderedTasks);
        } catch (error) {
            console.error('Erro ao atualizar as ordens no backend:', error);
        }
    };
    
    // Para o botão de adicionar não sumir na mudança de estado
    useEffect(() => {
        Aos.refresh();
    }, [isAddClicked]);

    return(
        <Container className="ff-libre-franklin pb-5 container-base d-flex flex-column justify-content-start align-items-center position-relative">
            <Image src={Logo} alt="FATTO Logo" className="fatto-logo position-absolute top-0 start-0 ms-5 mt-4" data-aos='fade-up' data-aos-duration="2000"/>
            <h1 className='py-4 fw-bold text-center' data-aos='fade-left' data-aos-duration="2000">Desafio FATTO</h1>
            <h2 className='pb-2 mb-4' data-aos='fade-right' data-aos-duration="3000">Lista de Tarefas</h2>

            <Button data-aos='fade-left' data-aos-duration="2500" className={`btn-green w-25 py-2 ${isAddClicked ? 'add-false' : 'add-true'}`} onClick={() => setIsAddClicked(true)}>
                <i className="bi bi-plus-square fs-4"></i>
            </Button>
            
            <Container className={` w-75 bg-white border border-2 border-black rounded-4 ${isAddClicked ? 'add-true' : 'add-false'}`}>

                <h4 className='fw-bold mt-3 mb-3 d-flex justify-content-center'>Adicionar Nova Tarefa</h4>

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
                        <Button className='btn-green' onClick={handleSubmit}>
                            <i className="bi bi-plus-square fs-5" />
                        </Button>
                    </Col>
                    
                    <Col className='d-flex justify-content-start'>
                        <Button className='btn-secondary' onClick={() => setIsAddClicked(false)}>
                            <i class="bi bi-arrow-return-right"></i>
                        </Button>
                    </Col>
                </Row>

            </Container>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task, index) => (
                        <Task
                            index={index}
                            key={task._id}
                            _id={task._id}
                            name={task.name}
                            cost={task.cost}
                            deadline={task.deadline}
                            order={task.order}
                            tasks={tasks}
                            setTasks={setTasks}
                            isEditing={editingTaskId === task._id}
                            setEditingTaskId={setEditingTaskId}
                        />
                    ))}
                </SortableContext>
            </DndContext>

        </Container>
    )
}

export default MainPage;