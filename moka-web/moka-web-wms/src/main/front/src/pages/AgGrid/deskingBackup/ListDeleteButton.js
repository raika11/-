import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@moka/fontawesome-pro-solid-svg-icons';

const ListDeleteButton = (props) => {
    return <FontAwesomeIcon className="align-middle mr-2" icon={faMinusCircle} fixedWidth />;
};

export default ListDeleteButton;
