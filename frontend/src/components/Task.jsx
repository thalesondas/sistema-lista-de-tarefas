import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
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

    return(
        <>
            <Container xs={10} className={`mt-3 py-3 w-75 fs-4 d-flex align-items-center ${moreThan1000() ? "bg-warning" : "container-task"}`}>
                <Col className='d-flex justify-content-evenly'>
                    <span>{props.name}</span>
                    <span>{cost}</span>
                    <span>{deadline}</span>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => setIsEditClicked(!editClicked)} className='me-3 btn-primary'><i class="bi bi-pencil-square fs-5" /></Button>
                    <Button onClick={() => setShowDeleteModal(true)} className='btn-danger'><i class="bi bi-x-square fs-5" /></Button>
                </Col>
            </Container>
        
            {editClicked ?
            
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
                            <Button className='btn-success'>
                                <i class="bi bi-plus-square fs-5" />
                            </Button>
                        </Col>
                        
                        <Col className='d-flex justify-content-start'>
                            <Button className='btn-danger' onClick={() => setIsEditClicked(false)}>
                                <i class="bi bi-x-square fs-5" />
                            </Button>
                        </Col>
                    </Row> 
                </Container>
                :
                null
            }

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
                    <Button variant="danger" onClick={() => {
                        console.log(`Excluindo a tarefa: ${props.name}`);
                        setShowDeleteModal(false);
                    }}>
                    Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Task;