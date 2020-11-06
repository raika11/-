import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changePageBody } from '@store/page/pageAction';

const PageEditor = (props) => {
    const { expansion, onExpansion } = props;
    const dispatch = useDispatch();
    const { pageBody, page, latestDomainId, invalidList, loading, inputTag } = useSelector(
        (store) => ({
            pageBody: store.page.pageBody,
            page: store.page.page,
            latestDomainId: store.auth.latestDomainId,
            invalidList: store.page.invalidList,
            loading:
                store.loading['page/GET_PAGE'] ||
                store.loading['page/POST_PAGE'] ||
                store.loading['page/PUT_PAGE'] ||
                store.loading['page/DELETE_PAGE'] ||
                store.loading['merge/PREVIEW_PAGE'] ||
                store.loading['merge/W3C_PAGE'],
            inputTag: store.page.inputTag,
        }),
        [shallowEqual],
    );

    // state
    const [defaultValue, setDefaultValue] = useState('');
    const [title, setTitle] = useState('페이지 편집');
    const [error, setError] = useState({});

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
        let isInvalid = false;

        // invalidList 처리
        invalidList.forEach((i) => {
            if (i.field === 'pageBody') {
                setError({
                    line: Number(i.extra),
                    message: i.reason,
                });
                isInvalid = isInvalid || true;
            }
        });

        if (!isInvalid) {
            setError({});
        }
    }, [invalidList]);

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
