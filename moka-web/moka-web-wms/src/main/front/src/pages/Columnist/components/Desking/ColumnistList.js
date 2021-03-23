import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ColumnistDeskSearch from './ColumnistDeskSearch';
import ColumnistDeskAgGrid from './ColumnistDeskAgGrid';
import { clearStore } from '@store/columnist';

const propTypes = {};
const defaultProps = {};

/**
 * 페이지편집 > 칼럼니스트 목록
 */
const ColumnistList = (props) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            dispatch(clearStore());
        }
    }, [dispatch, show]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <ColumnistDeskSearch selectedComponent={selectedComponent} show={show} />
            <ColumnistDeskAgGrid dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
};

ColumnistList.propTypes = propTypes;
ColumnistList.defaultProps = defaultProps;

export default ColumnistList;
