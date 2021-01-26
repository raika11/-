import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { initializeBannedParams, clearStore } from '@store/commentManage';
import { useDispatch } from 'react-redux';

const BannedList = React.lazy(() => import('./BannedList'));

/**
 * 차단관리
 */
const Banned = ({ match, ...rest }) => {
    const dispatch = useDispatch();
    const pathName = useRef(null);
    const [pagesParams, setPagesParams] = useState(initpagesParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정.
        const initPageParams = ({ path }) => {
            const pathName = path.split('/').reverse()[0];
            switch (pathName) {
                case 'banned-id':
                    setPagesParams({
                        pagePathName: pathName,
                        pageGubun: 'U',
                        pageName: '차단ID 관리',
                    });
                    break;
                case 'banned-ip':
                    setPagesParams({
                        pagePathName: pathName,
                        pageGubun: 'I',
                        pageName: '차단IP 관리',
                    });
                    break;
                case 'banned-word':
                    setPagesParams({
                        pagePathName: pathName,
                        pageGubun: 'W',
                        pageName: '금지어 관리',
                    });
                    break;
                default:
                    // 없는 데이터 처리는 어떻게?
                    console.log('경로에서 페이지 데이터를 가지고 오지 못했습니다.');
            }
        };

        // 최초 로딩 이거나 path 변경 되었을때.
        if (pagesParams === initpagesParams || pathName.current !== match.path) {
            pathName.current = match.path;
            initPageParams(match);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

    // 파라미터가 변경 되면 store에 등록.
    useEffect(() => {
        const storeInit = ({ pagePathName }) => {
            if (pagePathName !== '') {
                dispatch(initializeBannedParams(pagesParams));
            }
        };
        storeInit(pagesParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagesParams]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>{`${pagesParams.pageName}`}</title>
                <meta name="description" content={`${pagesParams.pageName} 페이지 입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[`/${pagesParams.pagePathName}`]}
                    exact
                    render={() => (
                        <Suspense>
                            <BannedList {...rest} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

const initpagesParams = {
    pagePathName: '', // 라우터 명.
    pageGubun: '', // 구분값 ( id, ip, word ).
    pageName: '', // 페이지명.
};

export default Banned;
