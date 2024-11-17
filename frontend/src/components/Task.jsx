import { Container } from 'react-bootstrap';
import '../assets/Task.css'

const Task = (props) => {
    return(
        <Container className='container-task my-3 py-3 w-75 fs-4 d-flex justify-content-center'>
            <span>{props.name}</span>
        </Container>
    )
}

export default Task;