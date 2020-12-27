import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';
import { clearStore } from '@store/articleSource';
import ArticleSourceEdit from './ArticleSourceEdit';

const ArticleSourceList = React.lazy(() => import('./ArticleSourceList'));

const ArticleSourcePage = (props) => {
    const { match, location } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    // local state
    const [footerBtns, setFooterBtns] = useState([]);
    const [clickMapping, setClickMapping] = useState(false);
    const [clickSave, setClickSave] = useState(false);

    /**
     * 코드 매핑
     */
    // const handleClickMapping = () => {
    //     setShowModal(true);
    // };

    /**
     * 등록, 수정
     */
    // const handleClickSave = useCallback(
    //     (temp) => {
    //         dispatch(
    //             saveArticleSource({
    //                 source: temp,
    //                 callback: ({ header, body }) => {
    //                     if (header.success) {
    //                         toast.success(header.message);
    //                         history.push(`${match.url}/${body.souceCode}`);
    //                     } else {
    //                         toast.fail(header.message);
    //                     }
    //                 },
    //             }),
    //         );
    //     },
    //     [dispatch, history, match.url],
    // );

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let btns = [
            { text: '코드 매핑', variant: 'outline-table-btn', className: 'mr-2', onClick: () => setClickMapping(true) },
            { text: '수정', variant: 'positive', onClick: () => setClickSave(true) },
        ];

        if (location.pathname.lastIndexOf('add') > -1) {
            let updatedBtns = btns.map((btn) => (btn.text !== '수정' ? btn : { ...btn, text: '등록' }));
            setFooterBtns(updatedBtns);
        } else {
            setFooterBtns(btns);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 매체 관리</title>
                <meta name="description" content="수신매체관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 수신 매체 리스트 */}
            <MokaCard header={false} width={812} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column">
                <Suspense>
                    <ArticleSourceList />
                </Suspense>
            </MokaCard>

            {/* 수신 매체 편집 */}
            <Switch>
                <Route
                    path={[`${match.url}/add`, `${match.url}/:sourceCode`]}
                    exact
                    render={() => (
                        <>
                            <MokaCard width={782} titleClassName="mb-0" title="매체 정보" footer footerButtons={footerBtns} footerClassName="justify-content-center">
                                <ArticleSourceEdit
                                    location={location}
                                    clickMapping={clickMapping}
                                    clickSave={clickSave}
                                    setClickMapping={setClickMapping}
                                    setClickSave={setClickSave}
                                />
                            </MokaCard>
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default ArticleSourcePage;
