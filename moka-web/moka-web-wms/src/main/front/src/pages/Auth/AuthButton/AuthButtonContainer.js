import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const AuthButtonContainer = ({ text, variant, children, ...rest }) => {
    const [hasAuth, setHasAuth] = useState(false);
    const { menu, latestMenuId } = useSelector((store) => ({
        menu: store.auth.menu,
        latestMenuId: store.auth.latestMenuId,
    }));

    useEffect(() => {
        const target = menu.menuById[latestMenuId];
        setHasAuth(target.editYn === 'Y');
    }, [latestMenuId]);

    return (
        hasAuth && (
            <Button variant={variant} {...rest}>
                {children}
            </Button>
        )
    );
};

export default AuthButtonContainer;
