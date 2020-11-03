import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@components';
import { copyTemplate } from '@store/template/templateAction';
import { notification } from '@utils/toastUtil';

/**
 * 템플릿 복사 Modal
 */
const DefaultInputModal = (props) => {
    const { title, show, onHide, inputData, onSave } = props;
    const [data, setData] = useState({ title: '', value: '', isInvalid: false });

    /**
     * 닫기
     */
    const handleClickHide = () => {
        setData({ title: '', value: '', isInvalid: false });
        onHide();
    };

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setData({
            ...data,
            value: e.target.value,
        });
    };

    /**
     * 저장 버튼 클릭 이벤트
     */
    const handleClickSave = () => {
        onSave(data, setData);
    };

    /**
     * inputData 값 변경
     */
    useEffect(() => {
        setData(inputData);
    }, [inputData]);

    return (
        <MokaModal
            show={show}
            onHide={handleClickHide}
            title={title}
            size="md"
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleClickSave },
                { text: '취소', variant: 'gray150', onClick: handleClickHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <MokaInputLabel label={data.title} labelWidth={90} className="mb-0" value={data.value} onChange={handleChangeValue} isInvalid={data.isInvalid} />
            </Form>
        </MokaModal>
    );
};

export default DefaultInputModal;
