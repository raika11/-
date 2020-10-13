import React, { forwardRef } from 'react';
import clsx from 'clsx';

import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';

import bg from '@assets/images/bg.jpeg';

const profileCustomToggle = forwardRef(({ children, onClick, id }, ref) => {
    return (
        <div ref={ref} className="dropdown-toggle" onClick={onClick} id={id}>
            {children}
        </div>
    );
});

/**
 * 프로필
 */
const Profile = ({ className }) => {
    return (
        <div className={clsx('d-flex', 'align-items-center', 'position-relative', className)}>
            <div className="d-flex flex-direction-column align-items-end mr-3">
                <p className="h5 mb-0">사용자명</p>
                <p className="h6 mb-0">로그인</p>
            </div>
            <Dropdown>
                <Dropdown.Toggle as={profileCustomToggle} id="dropdown-profile">
                    <Image width="40" height="40" src={bg} roundedCircle />
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight>
                    <Dropdown.Item eventKey="1">테스트1</Dropdown.Item>
                    <Dropdown.Item eventKey="2">테스트2</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default Profile;
