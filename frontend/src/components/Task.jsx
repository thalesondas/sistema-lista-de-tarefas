import { Button, Col, Container } from 'react-bootstrap';
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

    const moreThan1000 = () => {
        return props.cost >= 1000;
    };

    return(
        <Container xs={10} className={`container-task my-3 py-3 w-75 fs-4 d-flex align-items-center ${moreThan1000() ? "bg-warning" : ""}`}>
            <Col className='d-flex justify-content-evenly'>
                <span>{props.name}</span>
                <span>{cost}</span>
                <span>{deadline}</span>
            </Col>
            <Col xs={2}>
                <Button className='me-3 btn-primary'><i class="bi bi-pencil-square fs-5"></i></Button>
                <Button className='btn-danger'><i class="bi bi-x-square fs-5"></i></Button>
            </Col>
        </Container>
    )
}

export default Task;