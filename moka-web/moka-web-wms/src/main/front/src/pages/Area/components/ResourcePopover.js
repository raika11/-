import React from 'react';
import Popover from 'react-bootstrap/Popover';

/**
 * 미리보기 리소스 설명하는 popover
 */
const ResourcePopover = (
    <Popover id="popover-area-info">
        <Popover.Title>미리보기 리소스</Popover.Title>
        <Popover.Content className="user-select-text">
            페이지편집에서 미리보기를 서비스하기 위한 리소스를 추가하세요.
            <br />
            (서비스 화면과 별도로 설정해야합니다.)
            <br />
            변환된 html은 <span>{`\$\{SYSTEM_AREA\}`}</span> 토큰을 사용하세요.
            <br />
            예약어는 <span>{`\$\{reserved.예약어\}`}</span> 토큰을 사용하세요.
        </Popover.Content>
    </Popover>
);

export default ResourcePopover;
