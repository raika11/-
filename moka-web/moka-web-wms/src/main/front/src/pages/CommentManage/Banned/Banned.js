import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Switch, Route, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { initializeBannedParams, clearStore, getInitData } from '@store/commentManage';
import BannedList from './BannedList';

/**
 * 댓글 관리 > 차단 관리
 */
const Banned = ({ match, ...rest }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const pathName = useRef(null);
    const [pagesParams, setPagesParams] = useState(initpagesParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정.
        const initPageParams = ({ path }) => {
            const pathName = path.replace('/', '');
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
                    history.push('/404');
            }
        };

        // 최초 로딩 이거나 path 변경 되었을때.
        if (pagesParams === initpagesParams || pathName.current !== match.path) {
            pathName.current = match.path;
            initPageParams(match);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

    useEffect(() => {
        // 파라미터가 변경 되면 store에 등록.
        const storeInit = ({ pagePathName }) => {
            if (pagePathName !== '') {
                dispatch(initializeBannedParams(pagesParams));
            }
        };
        storeInit(pagesParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagesParams]);

    useEffect(() => {
        dispatch(getInitData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>{`${pagesParams.pageName}`}</title>
                    <meta name="description" content={`${pagesParams.pageName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Switch>
                    <Route
                        path={[`/${pagesParams.pagePathName}`]}
                        exact
                        render={() => (
                            <Col sm={12} md={12} className="p-0">
                                <BannedList match={match} />
                            </Col>
                        )}
                    />
                </Switch>
            </Row>
        </Container>
    );
};

const initpagesParams = {
    pagePathName: '', // 라우터 명.
    pageGubun: '', // 구분값 ( id, ip, word ).
    pageName: '', // 페이지명.
};

export default Banned;
