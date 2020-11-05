import React from 'react';
import { useDispatch } from 'react-redux';
import { MokaTableLoadButton } from '@components';
import { changePageBody } from '@store/page';
import { toastr } from '@utils/toastUtil';

const PageLoadButton = (props) => {
    const dispatch = useDispatch();
    const { data } = props;

    const handleClick = () => {
        toastr.confirm('불러오기 시 작업 중인 tems 소스가 날라갑니다. 불러오시겠습니까?', {
            onOk: () => {
                dispatch(changePageBody(data.pageBody));
            },
            onCancel: () => {},
        });
    };

    return <MokaTableLoadButton onClick={handleClick} />;
};

export default PageLoadButton;
