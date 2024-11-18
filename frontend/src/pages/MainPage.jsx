import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Task from '../components/Task';
import axios from 'axios';
import '../assets/MainPage.css';

const MainPage = () => {

    const [tasks, setTasks] = useState([]);

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

    return(
        <Container className='container-base d-flex flex-column justify-content-start align-items-center'>
            <h1 className='py-4'>Desafio FATTO</h1>
            <h2 className='pb-2'>Lista de Tarefas</h2>
            {tasks.map((task) => (
                <Task name={task.name} cost={task.cost} deadline={task.deadline}/>
            ))}
        </Container>
    )
}

export default MainPage;