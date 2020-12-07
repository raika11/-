import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import avatar from './image_test.jpg';

const TaskComponent = ({ text }) => {
    return (
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
};

export default TaskComponent;
