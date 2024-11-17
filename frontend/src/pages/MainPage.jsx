import { Container } from 'react-bootstrap'
import Task from '../components/Task';
import '../assets/MainPage.css'

const MainPage = () => {
    return(
        <Container className='container-base d-flex flex-column justify-content-start align-items-center'>
            <h1 className='py-4'>Desafio FATTO</h1>
            <h2 className='pb-2'>Lista de Tarefas</h2>
            <Task name="Task1"/>
            <Task name="Task2"/>
            <Task name="Task3"/>
            <Task name="Task4"/>
            <Task name="Task5"/>
        </Container>
    )
}

export default MainPage;