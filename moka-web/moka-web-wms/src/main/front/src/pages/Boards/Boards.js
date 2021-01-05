import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearStore, initializeParams, getBoardChannelTypeList } from '@store/board';

const BoardsSet = React.lazy(() => import('./BoardsSet'));
const BoardsList = React.lazy(() => import('./BoardsList'));

const Boards = ({ match }) => {
    const dispatch = useDispatch();
    const pathName = useRef(match.path);
    const [pagesParams, setPagesParams] = useState(initpagesParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정.
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
                    // 없는 데이터 처리는 어떻게?
                    console.log('경로에서 페이지 데이터를 가지고 오지 못했습니다.');
            }
        };

        // 최초 로딩 이거나 path 변경 되었을때.
        if (pagesParams === initpagesParams || pathName.current !== match.path) {
            pathName.current = match.path;
            initPageParams(match);
        }
    }, [match, pagesParams]);

    // 파라미터가 변경 되면 store에 등록.
    useEffect(() => {
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
        <Suspense>
            <BoardsSet />
        </Suspense>
    ) : (
        <Suspense>
            <BoardsList />
        </Suspense>
    );
};

const initpagesParams = {
    pagePathName: '', // 라우터 명.
    gubun: '',
};

export default Boards;
