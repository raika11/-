import React, { useEffect, useRef, useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';
import { clearStore } from '@store/articleSource';
import ArticleSourceEdit from './ArticleSourceEdit';
import ArticleSourceList from './ArticleSourceList';

/**
 * 수신 매체 관리
 */
const ArticleSource = (props) => {
    const { match } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const editRef = useRef(null);

    /**
     * 코드 매핑
     */
    const handleClickMapping = useCallback(() => {
        if (editRef.current) {
            editRef.current.onMapping();
        }
    }, []);

    /**
     * 저장, 수정
     */
    const handleClickSave = useCallback(() => {
        if (editRef.current) {
            editRef.current.onSave();
        }
    }, []);

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 매체 관리</title>
                <meta name="description" content="수신 매체 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 수신 매체 리스트 */}
            <MokaCard width={812} className="mr-gutter" bodyClassName="d-flex flex-column" title="수신 매체 관리">
                <ArticleSourceList match={match} />
            </MokaCard>

            {/* 수신 매체 편집 */}
            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:sourceCode`]}
                    exact
                    render={() => {
                        return (
                            <MokaCard
                                className="flex-fill"
                                title="매체 정보"
                                footer
                                footerButtons={[
                                    { text: '코드 매핑', variant: 'outline-neutral', className: 'mr-1', onClick: handleClickMapping },
                                    { text: match.params?.sourceCode ? '수정' : '저장', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                                    { text: '취소', variant: 'negative', onClick: handleClickCancel },
                                ]}
                            >
                                <ArticleSourceEdit match={match} ref={editRef} />
                            </MokaCard>
                        );
                    }}
                />
            </Switch>
        </div>
    );
};

export default ArticleSource;
