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
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_PAGE] || loading[DELETE_ARTICLE_PAGE] || loading[SAVE_ARTICLE_PAGE]);
    const { artPageBody, articlePage, invalidList, inputTag } = useSelector((store) => ({
        artPageBody: store.articlePage.artPageBody,
        articlePage: store.articlePage.articlePage,
        invalidList: store.articlePage.invalidList,
        inputTag: store.articlePage.inputTag,
    }));

    // state
    const [title, setTitle] = useState('기사페이지 수정');
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
            setTitle(`기사페이지 수정(${articlePage.artPageSeq}_${articlePage.artPageName})`);
            // defaultValue 변경
            setDefalutValue(artPageBody);
        } else {
            setTitle('기사페이지 등록');
            setDefalutValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articlePage.artPageSeq, articlePage.artPageName]);

    useEffect(() => {
        // 기사페이지의 도메인ID를 latestDomainId에 저장
        if (Object.prototype.hasOwnProperty.call(articlePage, 'domain')) {
            const domainId = articlePage.domain.domainId;
            if (domainId && latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, articlePage]);

    useEffect(() => {
        // seq가 있을 때 데이터 조회
        if (artPageSeq) {
            dispatch(getArticlePage({ artPageSeq: artPageSeq }));
        } else {
            dispatch(clearArticlePage());
        }
    }, [dispatch, artPageSeq]);

    useEffect(() => {
        // 본문 에러만 체크
        const bodyErrorList = invalidList.filter((e) => e.field === 'artPageBody');
        if (bodyErrorList.length > 0) {
            setError({
                line: Number(bodyErrorList[0].extra),
                message: bodyErrorList[0].reason,
            });
        } else {
            setError({});
        }
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearArticlePage());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
