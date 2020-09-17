import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const DropdownComponent = (props) => {
    const { title, ...rest } = props;
    const [show, setShow] = useState(false);
    const [header, setHeader] = useState();
    const [divider, setDivider] = useState();
    const [item, setItem] = useState([]);

    // useEffect(() => {
    //     /** Menu header */
    //     setHeader(<Dropdown.Header>{title}</Dropdown.Header>);
    // }, [header]);

    // useEffect(() => {
    //     /** Menu divider */
    //     setDivider(<Dropdown.Divider />);
    // }, [divider]);

    useEffect(() => {
        /** Dropdown items */
        setItem(
            item.map((item, idx) => (
                <Dropdown.Item key={idx} eventKey={item.eventKey}>
                    {item.title}
                </Dropdown.Item>
            ))
        );
    }, [header, divider, item]);

    return <Dropdown.Menu {...rest}>{setItem}</Dropdown.Menu>;
};

export default DropdownComponent;
