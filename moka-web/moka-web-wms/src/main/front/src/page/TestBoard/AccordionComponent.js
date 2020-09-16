import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AccordionComponent = (props) => {
    const { card, ...rest } = props;
    const [accordionList, setAccordionList] = useState([]);

    useEffect(() => {
        /** accordion list */
        setAccordionList(
            card.map((c, idx) => (
                <Card key={idx}>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={c.eventKey}>
                            {c.title}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={c.eventKey}>
                        <Card.Body>
                            <div>{c.content}</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            ))
        );
    }, [card]);

    return (
        <Accordion defaultActiveKey={card[0].eventKey} {...rest}>
            {accordionList}
        </Accordion>
    );
};
export default AccordionComponent;
