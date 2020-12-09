import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changeArticlePageBody, getArticlePage, clearArticlePage, GET_ARTICLE_PAGE, DELETE_ARTICLE_PAGE, SAVE_ARTICLE_PAGE } from '@store/articlePage/articlePageAction';

const ArticlePageEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { artPageSeq } = useParams();
    const dispatch = useDispatch();
    const { artPageBody, articlePage, invalidList, latestDomainId, loading, inputTag } = useSelector((store) => ({
        artPageBody: store.articlePage.artPageBody,
        articlePage: store.articlePage.articlePage,
        invalidList: store.articlePage.invalidList,
        latestDomainId: store.auth.latestDomainId,
        loading: store.loading[GET_ARTICLE_PAGE] || store.loading[DELETE_ARTICLE_PAGE] || store.loading[SAVE_ARTICLE_PAGE],
        inputTag: store.articlePage.inputTag,
    }));

    // state
    const [title, setTitle] = useState('기사페이지 편집');
    const [defaultValue, setDefalutValue] = useState('');
    const [error, setError] = useState({});

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeArticlePageBody(value));
    };

    useEffect(() => {
        // 타이틀 변경
        if (articlePage.artPageSeq) {
            setTitle(`기사페이지 편집(${articlePage.artPageSeq}_${articlePage.artPageName})`);
            // defaultValue 변경
            setDefalutValue(artPageBody);
        } else {
            setTitle('기사페이지 편집');
            setDefalutValue('');
        }
    }, [artPageBody, articlePage.artPageName, articlePage.artPageSeq]);

    useEffect(() => {
        // 기사페이지의 도메인ID를 latestDomainId에 저장
        if (Object.prototype.hasOwnProperty.call(articlePage, 'domain')) {
            const domainId = articlePage.domain.domainId;
            if (domainId && latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
    }, [dispatch, articlePage, latestDomainId]);

    useEffect(() => {
        // 템플릿seq가 있을 때 데이터 조회
        if (artPageSeq) {
            dispatch(getArticlePage({ artPageSeq: artPageSeq }));
        } else {
            dispatch(clearArticlePage());
        }
    }, [dispatch, artPageSeq]);

    useEffect(() => {
        let isInvalid = false;

        // invalidList 처리
        invalidList.forEach((i) => {
            if (i.field === 'artPageBody') {
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

    return (
        <MokaCardEditor
            className="mr-gutter flex-fill"
            error={error}
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            defaultValue={defaultValue}
            value={artPageBody}
            onBlur={handleBlur}
            loading={loading}
            tag={inputTag}
        />
    );
};

export default ArticlePageEditor;
