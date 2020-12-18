import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import ArticleDeskSearch from './ArticleDeskSearch';
import ArticleDeskAgGrid from './ArticleDeskAgGrid';
import { clearList, clearSearch } from '@store/article';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 영상 기사 리스트 조회인가?
     */
    media: PropTypes.bool,
    /**
     * 선택한 컴포넌트의 데이터
     */
    selectedComponent: PropTypes.object,
    /**
     * drag&drop 타겟 ag-grid
     */
    dropTargetAgGrid: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    /**
     * row를 drop하였을 때 실행하는 함수
     */
    onDragStop: PropTypes.func,
    /**
     * show 일 때만 데이터를 로드한다
     */
    show: PropTypes.bool,
};
const defaultProps = {
    selectedComponent: {},
};

/**
 * 페이지편집 > 기사리스트
 */
const ArticleDeskList = forwardRef((props, ref) => {
    const { className, media, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // unmount
            dispatch(clearList());
            dispatch(clearSearch());
        };
    }, [dispatch]);

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
            <ArticleDeskSearch media={media} selectedComponent={selectedComponent} show={show} />
            <ArticleDeskAgGrid ref={ref} dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
});

ArticleDeskList.propTypes = propTypes;
ArticleDeskList.defaultProps = defaultProps;

export default ArticleDeskList;
