import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@moka/fontawesome-pro-solid-svg-icons';

// 아이콘 등록
library.add(faCoffee);

// 사이드바 카테고리, 아이템에 쓰이는 아이콘 관리
const SidebarItemIcon = (props) => {
    const { iconName } = props;

    return iconName ? (
        <span className="align-middle">
            <FontAwesomeIcon icon={iconName} />
        </span>
    ) : null;
};

export default SidebarItemIcon;
