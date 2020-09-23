import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = (props) => {
    const { size, count, ...rest } = props;

    /** Page items */
    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Pagination size={size} {...rest}>
            <Pagination.Prev />
            {items}
            <Pagination.Next />
        </Pagination>
    );
};

export default PaginationComponent;
