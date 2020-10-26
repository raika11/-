import React from 'react';
import { useDispatch } from 'react-redux';
import { MokaTableLoadButton } from '@components';
import { changeTemplateBody } from '@store/template';
import { toastr } from '@utils/toastUtil';

const TemplateLoadButton = (props) => {
    const dispatch = useDispatch();
    const { data } = props;

    const handleClick = () => {
        toastr.confirm('불러오기 시 작업 중인 템플릿 본문 내용이 날라갑니다. 불러오시겠습니까?', {
            onOk: () => {
                dispatch(changeTemplateBody(data.templateBody));
            },
            onCancle: () => {},
        });
    };

    return <MokaTableLoadButton onClick={handleClick} />;
};

export default TemplateLoadButton;
