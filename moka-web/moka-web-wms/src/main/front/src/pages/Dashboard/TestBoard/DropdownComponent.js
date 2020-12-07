import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import PropTypes from 'prop-types';

const DropdownComponent = (props) => {
    const {
        variant,
        id,
        header,
        split,
        items,
        title,
        headerTitle,
        // divider = true,
        ...rest
    } = props;
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        /** Dropdown items */
        setItemList(
            items.map((i, idx) => (
                <Dropdown.Item key={idx} eventKey={i.eventKey}>
                    {i.title}
                </Dropdown.Item>
            )),
        );
    }, [items]);

    return (
        <Dropdown as={split && ButtonGroup} {...rest}>
            <Dropdown.Toggle variant={variant} id={id} split={split && true}>
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {header && <Dropdown.Header>{headerTitle}</Dropdown.Header>}
                {itemList}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropdownComponent;
