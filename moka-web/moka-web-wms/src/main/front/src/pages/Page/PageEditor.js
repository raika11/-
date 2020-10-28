import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changePageBody, getPage, clearPage, clearHistory, clearRelationList } from '@store/page/pageAction';

const PageEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { pageSeq } = useParams();
    const dispatch = useDispatch();
    const { pageBody, page, latestDomainId } = useSelector((store) => ({
        pageBody: store.page.pageBody,
        page: store.page.page,
        latestDomainId: store.auth.latestDomainId,
    }));

    // state
    const [title, setTitle] = useState('페이지 편집');

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changePageBody(value));
    };

    useEffect(() => {
        // 타이틀 변경
        if (page.pageSeq) {
            setTitle(`페이지 편집(${page.pageSeq}_${page.pageName})`);
        } else {
            setTitle('페이지 편집');
        }
    }, [page]);

    useEffect(() => {
        // 페이지의 도메인ID를 latestDomainId에 저장
        if (Object.prototype.hasOwnProperty.call(page, 'domain')) {
            const domainId = page.domain.domainId;
            if (latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    useEffect(() => {
        // 페이지seq가 있을 때 데이터 조회
        if (pageSeq) {
            dispatch(getPage({ pageSeq: pageSeq }));
        } else {
            dispatch(clearPage());
            dispatch(clearRelationList());
            dispatch(clearHistory());
        }
    }, [dispatch, pageSeq]);

    return <MokaCardEditor className="mr-10 flex-fill" title={title} expansion={expansion} onExpansion={onExpansion} defaultValue={pageBody} onBlur={handleBlur} />;
};

export default PageEditor;
