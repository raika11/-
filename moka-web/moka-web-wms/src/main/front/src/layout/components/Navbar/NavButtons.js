import React from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';
import { logout } from '@store/auth/authAction';

const NavButtons = () => {
    const dispatch = useDispatch();

    return (
        <div>
            {/* 로그아웃 버튼 */}
            <Button as="a" variant="white" className="px-05" onClick={() => dispatch(logout())}>
                <MokaIcon iconName="fal-sign-out-alt" size="lg" />
            </Button>
        </div>
    );
};

export default NavButtons;
