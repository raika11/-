import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
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
    component: PropTypes.object,
};
const defaultProps = {
    component: {},
};

/**
 * 페이지편집 > 기사리스트
 */
const ArticleDeskList = forwardRef((props, ref) => {
    const { className, media, component } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // unmount
            dispatch(clearList());
            dispatch(clearSearch());
        };
    }, [dispatch]);

    return (
        <div className={className}>
            <ArticleDeskSearch media={media} component={component} />
            <ArticleDeskAgGrid ref={ref} />
        </div>
    );
});

ArticleDeskList.propTypes = propTypes;
ArticleDeskList.defaultProps = defaultProps;

export default ArticleDeskList;
