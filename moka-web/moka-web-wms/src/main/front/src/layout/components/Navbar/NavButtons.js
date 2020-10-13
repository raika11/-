import React from 'react';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@moka/fontawesome-pro-light-svg-icons';

const NavButtons = () => {
    return (
        <div>
            <Button as="a" variant="light" className="p-0 mr-3">
                <FontAwesomeIcon icon={faCoffee} size="lg" />
            </Button>
            <Button as="a" variant="light" className="p-0">
                <FontAwesomeIcon icon={faCoffee} size="lg" />
            </Button>
        </div>
    );
};

export default NavButtons;
