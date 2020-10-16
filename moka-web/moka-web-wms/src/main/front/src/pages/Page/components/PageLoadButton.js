import React, { useCallback } from 'react';
import { toastr } from 'react-redux-toastr';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const PageLoadButton = (props) => {
    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            const { data } = props;
            if (data) {
                console.log(data);
            }
            toastr.confirm(
                <>
                    <p>불러오기 시 작업 중인 템플릿 본문 내용이 사라집니다.</p>
                    <p>불러오시겠습니까?</p>
                </>,
                {
                    onOk: () => alert('OK: clicked'),
                    onCancle: () => alert('CANCLE: clicked'),
                    okText: '예',
                    cancelText: '아니오',
                    // custom css selector
                    // id: 'my-custom-id'
                },
            );
        },
        [props],
    );

    return (
        <Button variant="white" onClick={handleClick}>
            <MokaIcon iconName="fal-file-import" />
        </Button>
    );
};

export default PageLoadButton;
