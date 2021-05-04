import React from 'react';
import Badge from 'react-bootstrap/Badge';
import { MokaIcon } from '@components';

const CustomBadge = ({ text, index, onDelete }) => {
    return (
        <Badge className="mr-1 mb-1 pt-1 ft-13" variant="gray-700">
            {text}
            {onDelete && <MokaIcon iconName="fas-times" className="ml-1 cursor-pointer" onClick={() => onDelete(index)} />}
        </Badge>
    );
};

export default CustomBadge;
