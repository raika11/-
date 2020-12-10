import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { getSpecialchar, saveSpecialchar } from '@store/bulks';
import toast, { messageBox } from '@utils/toastUtil';
const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,

    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const SpecialCharModal = (props) => {
    const dispatch = useDispatch();
    const { specialchar } = useSelector((store) => ({
        specialchar: store.bulks.specialchar,
    }));

    const [specialChar, setSpecialChar] = useState('');

    const handleChangeInput = (inputValue) => {
        setSpecialChar(inputValue);
    };

    const handleClickSaveButton = () => {
        dispatch(
            saveSpecialchar({
                specialchar: specialChar,
                callback: ({ header: { success, message }, body: { list } }) => {
                    if (success === true) {
                        toast.success(message);
                        dispatch(getSpecialchar());
                        props.onHide();
                    } else {
                        if (list && Array.isArray(list)) {
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    useEffect(() => {
        const initPage = () => {
            setSpecialChar(specialchar.cdNm);
        };

        if (props.show === true) {
            initPage();
        }
    }, [dispatch, props.show, specialchar]);

    return (
        <MokaModal show={props.show} onHide={props.onHide} title="약물 등록" size="xl" footerClassName="justify-content-center" width={700} draggable>
            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel className="mb-0" id="specialchar" name="specialchar" value={specialChar} onChange={(e) => handleChangeInput(e.target.value)} />
                    </Col>
                </Form.Row>
            </Form>
            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-05" onClick={(e) => handleClickSaveButton(e)}>
                        저장
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={props.onHide}>
                        취소
                    </Button>
                </div>
            </div>
        </MokaModal>
    );
};

SpecialCharModal.propTypes = propTypes;
SpecialCharModal.defaultProps = defaultProps;

export default SpecialCharModal;
