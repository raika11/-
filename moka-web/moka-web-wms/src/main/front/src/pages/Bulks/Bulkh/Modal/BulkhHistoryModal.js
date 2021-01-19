import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MokaModal } from '@components';
import { Col, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { clearHotclickHistorylist, getHotclickHistoryList } from '@store/bulks';

import HistoryAgGrid from './HistoryAgGrid';
import HistoryDetailAgGrid from './HistoryDetailAgGrid';

const propTypes = {
    control: PropTypes.object,
};
const defaultProps = {};

/**
 * 핫클릭 히스토리 모달.
 */
const BulkhHistoryModal = ({ show, onHide }) => {
    const dispatch = useDispatch();

    // 모달 상태가 변경 되면 데이터를 가지고 오고 클리어 해준다.
    useEffect(() => {
        if (show === true) {
            dispatch(getHotclickHistoryList());
        } else {
            dispatch(clearHotclickHistorylist());
        }
    }, [dispatch, show]);

    return (
        <MokaModal show={show} onHide={() => onHide()} title="핫클릭 히스토리" size="xl" headerClassName="mb-0 pl-4 pb-0" width={1150} height={750} draggable>
            <Form.Row>
                <Col>
                    <HistoryAgGrid />
                </Col>
                <Col>
                    <HistoryDetailAgGrid />
                </Col>
            </Form.Row>
        </MokaModal>
    );
};

BulkhHistoryModal.propTypes = propTypes;
BulkhHistoryModal.defaultProps = defaultProps;

export default BulkhHistoryModal;
