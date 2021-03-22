import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearStore, initializeParams, getBoardChannelTypeList } from '@store/board';
import { MokaErrorBoundary } from '@components';
const BoardsSet = React.lazy(() => import('./BoardsSet'));
const BoardsList = React.lazy(() => import('./BoardsList'));

const initpagesParams = {
    pagePathName: '', // 라우터 명
    gubun: '',
};

/**
 * 게시판 관리 분기(전체 게시판, 게시글 관리)
 */
const Boards = ({ match, displayName }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const pathName = useRef(match.path);
    const [pagesParams, setPagesParams] = useState(initpagesParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정
        const initPageParams = ({ path }) => {
            const pathName = path.split('/').reverse()[0];
            switch (pathName) {
                case 'boards-set':
                    setPagesParams({
                        pagePathName: pathName,
                        boardType: 'S',
                        gubun: 'set',
                    });
                    break;
                case 'boards-list':
                    setPagesParams({
                        pagePathName: pathName,
                        boardType: 'S',
                        gubun: 'list',
                    });
                    break;
                case 'boarda-set':
                    setPagesParams({
                        pagePathName: pathName,
                        boardType: 'A',
                        gubun: 'set',
                    });
                    break;
                case 'boarda-list':
                    setPagesParams({
                        pagePathName: pathName,
                        boardType: 'A',
                        gubun: 'list',
                    });
                    break;
                default:
                    history.push(`${pathName}/404`);
            }
        };

        // 최초 로딩 이거나 path 변경 되었을때.
        if (pagesParams === initpagesParams || pathName.current !== match.path) {
            pathName.current = match.path;
            initPageParams(match);
        }
    }, [history, match, pagesParams]);

    useEffect(() => {
        // 파라미터가 변경 되면 store에 등록.
        const storeInit = ({ pagePathName }) => {
            if (pagePathName !== '') {
                dispatch(initializeParams(pagesParams));
                dispatch(getBoardChannelTypeList());
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

    return pagesParams.gubun === 'set' ? (
        <MokaErrorBoundary>
            <Suspense>
                <BoardsSet match={match} displayName={displayName} />
            </Suspense>
        </MokaErrorBoundary>
    ) : (
        <MokaErrorBoundary>
            <Suspense>
                <BoardsList match={match} displayName={displayName} />
            </Suspense>
        </MokaErrorBoundary>
    );
};

export default Boards;
