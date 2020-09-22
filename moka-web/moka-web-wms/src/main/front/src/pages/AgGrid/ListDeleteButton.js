import React from 'react';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListDeleteButton = (props) => {
    return <FontAwesomeIcon className="align-middle mr-2" icon={faMinusCircle} fixedWidth />;
};

export default ListDeleteButton;
