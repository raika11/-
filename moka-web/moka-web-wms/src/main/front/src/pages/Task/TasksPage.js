import React, { useState, forwardRef, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import avatar from './image_test.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const IconToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <FontAwesomeIcon icon={faEllipsisH} fixedWidth />
    </a>
));

const IconMenu = forwardRef(({ children, style, className }, ref) => {
    return (
        <div ref={ref} style={style} className={className}>
            <ul className="list-unstyled">{children}</ul>
        </div>
    );
});

const IconDropButton = () => (
    <Dropdown>
        <Dropdown.Toggle as={IconToggle} />
        <Dropdown.Menu as={IconMenu}>
            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
                Orange
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

const Task = ({ text }) => (
    <Card className="my-3 bg-light cursor-grab border">
        <Card.Body className="p-3">
            <Form.Check type="checkbox" className="float-right" />
            <p>{text}</p>
            <Image src={avatar} style={{ width: '32px', height: '32px' }} roundedCircle className="float-right" />
            <Button variant="primary" size="sm">
                View
            </Button>
        </Card.Body>
    </Card>
);

const TasksPage = () => {

    return (
        <Container>
            <h1>Tasks</h1>
            <Row>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                <div>Upcomings</div>
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                In Progress
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            {/* <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." /> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                On Hold
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            {/* <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." /> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                Completed
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TasksPage;
