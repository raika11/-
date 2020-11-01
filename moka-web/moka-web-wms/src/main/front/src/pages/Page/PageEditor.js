import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changePageBody } from '@store/page/pageAction';

const PageEditor = (props) => {
    const { expansion, onExpansion } = props;
    const dispatch = useDispatch();
    const { pageBody, page, latestDomainId, error, loading, tag } = useSelector((store) => ({
        pageBody: store.page.pageBody,
        page: store.page.page,
        latestDomainId: store.auth.latestDomainId,
        error: store.page.pageError,
        loading: store.loading['page/GET_PAGE'] || store.loading['page/POST_PAGE'] || store.loading['page/PUT_PAGE'] || store.loading['page/DELETE_PAGE'] || store.loading['merge/PREVIEW_PAGE'] || store.loading['merge/W3C_PAGE'],
        tag: store.page.tag,
    }));

    // state
    const [title, setTitle] = useState('페이지 편집');
    const [errorObj, setErrorObj] = useState({});

    /**
     * 타이틀 변경
     */
    useEffect(() => {
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
            if (domainId && latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    // useEffect(() => {
    //     // 페이지seq가 있을 때 데이터 조회
    //     if (paramPageSeq) {
    //         dispatch(getPage({ pageSeq: paramPageSeq }));
    //     } else {
    //         dispatch(clearPage());
    //         dispatch(clearRelationList());
    //         dispatch(clearHistory());
    //     }
    // }, [dispatch, paramPageSeq]);

    useEffect(() => {
        let bodyError = 0;
        if (error && error.body && Array.isArray(error.body.list)) {
            error.body.list.forEach((e) => {
                const { field, reason, extra } = e;
                if (field === 'pageBody') {
                    setErrorObj({
                        error: true,
                        message: reason,
                        line: Number(extra),
                    });
                    bodyError++;
                }
            });
        }
        if (bodyError < 1) setErrorObj({});
    }, [error]);

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changePageBody(value));
    };

    return (
        <MokaCardEditor
            className="mr-gutter flex-fill"
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            value={pageBody}
            onBlur={handleBlur}
            loading={loading}
            tag={tag}
            error={errorObj.error}
            errorline={errorObj.line}
            errorMessage={errorObj.message}
        />
    );
};

export default PageEditor;
