import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MokaModal } from '@components';
import { Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { clearHotclickHistorylist, getHotclickHistoryList } from '@store/bulks';
import HistoryAgGrid from './HistoryAgGrid';
import HistoryDetailAgGrid from './HistoryDetailAgGrid';

const propTypes = {
    control: PropTypes.object,
};
const defaultProps = {};

/**
 * 핫클릭 히스토리 모달
 */
const BulkhHistoryModal = ({ show, onHide }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        show ? dispatch(getHotclickHistoryList()) : dispatch(clearHotclickHistorylist());
    }, [dispatch, show]);

    return (
        <MokaModal show={show} onHide={() => onHide()} title="핫클릭 히스토리" size="xl" width={1150} height={750} draggable>
            <div className="d-flex h-100 w-100">
                <Col xs={5} className="p-0 pr-card d-flex flex-column">
                    <HistoryAgGrid />
                </Col>
                <Col xs={7} className="p-0">
                    <HistoryDetailAgGrid />
                </Col>
            </div>
        </MokaModal>
    );
};

BulkhHistoryModal.propTypes = propTypes;
BulkhHistoryModal.defaultProps = defaultProps;

export default BulkhHistoryModal;
