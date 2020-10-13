import React from 'react';

import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';

const NavButtons = () => {
    return (
        <div>
            <Button as="a" variant="light" className="p-0 mr-3">
                <MokaIcon iconName="fal-coffee" size="lg" />
            </Button>
            <Button as="a" variant="light" className="p-0">
                <MokaIcon iconName="fal-coffee" size="lg" />
            </Button>
        </div>
    );
};

export default NavButtons;
