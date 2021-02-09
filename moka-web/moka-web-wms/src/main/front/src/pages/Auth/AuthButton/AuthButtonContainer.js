import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import commonUtil from '@utils/commonUtil';

const AuthButtonContainer = ({ text, variant, children, ...rest }) => {
    const [hasAuth, setHasAuth] = useState(false);
    const { menu, latestMenuId } = useSelector((store) => ({
        menu: store.auth.menu,
        latestMenuId: store.auth.latestMenuId,
    }));

    useEffect(() => {
        let hasAuth = false;
        if (!commonUtil.isEmpty(menu) && !Array.isArray(menu) && menu instanceof Object && !commonUtil.isEmpty(latestMenuId)) {
            const target = menu.menuById[latestMenuId];
            hasAuth = target.editYn === 'Y';
        }
        setHasAuth(hasAuth);
    }, [menu, latestMenuId]);

    return (
        hasAuth && (
            <Button variant={variant} {...rest}>
                {children}
            </Button>
        )
    );
};

export default AuthButtonContainer;
