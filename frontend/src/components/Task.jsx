import { Container } from 'react-bootstrap';
import '../assets/Task.css'

const Task = (props) => {

    const deadline = new Date(props.deadline).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const cost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(props.cost);

    return(
        <Container className='container-task my-3 py-3 w-75 fs-4 d-flex justify-content-evenly'>
            <span>{props.name}</span>
            <span>{cost}</span>
            <span>{deadline}</span>
        </Container>
    )
}

export default Task;