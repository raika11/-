import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { W3C_PAGE, CHECK_SYNTAX } from '@store/merge';
import { getPage, changePageBody, GET_PAGE, SAVE_PAGE, DELETE_PAGE } from '@store/page';

/**
 * 페이지 본문 에디터
 */
const PageEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { pageSeq } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_PAGE] || loading[SAVE_PAGE] || loading[DELETE_PAGE] || loading[CHECK_SYNTAX] || loading[W3C_PAGE]);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { pageBody, page, invalidList, inputTag } = useSelector(({ page }) => page);

    // state
    const [title, setTitle] = useState('페이지 수정');
    const [error, setError] = useState({});
    const [defaultValue, setDefaultValue] = useState('');

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => dispatch(changePageBody(value));

    useEffect(() => {
        // 타이틀 변경
        if (page.pageSeq) {
            setTitle(`페이지 수정(${page.pageSeq}_${page.pageName})`);
        } else {
            setTitle('페이지 등록');
        }
    }, [page]);

    useEffect(() => {
        // defaultValue 셋팅
        if (page.pageSeq) {
            setDefaultValue(pageBody);
        } else {
            setDefaultValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.pageSeq]);

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

    useEffect(() => {
        // 페이지 상세 데이터 조회
        if (pageSeq) {
            dispatch(getPage({ pageSeq }));
        }
    }, [dispatch, pageSeq]);

    useEffect(() => {
        // 본문 에러만 체크
        const bodyErrorList = invalidList.filter((e) => e.field === 'pageBody');
        if (bodyErrorList.length > 0) {
            setError({
                line: Number(bodyErrorList[0].extra),
                message: bodyErrorList[0].reason,
            });
        } else {
            setError({});
        }
    }, [invalidList]);

    return (
        <MokaCardEditor
            className="mr-gutter flex-fill"
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            defaultValue={defaultValue}
            value={pageBody}
            onBlur={handleBlur}
            loading={loading}
            tag={inputTag}
            error={error}
        />
    );
};

export default PageEditor;
