import React, { useEffect, useState, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { clearStore, initializeParams } from '@store/bulks';
import { clearSpecialCharCode } from '@store/codeMgt';

const Bulkh = React.lazy(() => import('./Bulkh'));
const Bulkn = React.lazy(() => import('./Bulkn'));

const Bulks = ({ match }) => {
    const dispatch = useDispatch();
    const pathName = useRef(match.path);

    // 중앙일보 : bulk_source = '3'
    // 중앙썬데이 : bulk_source = '60'
    // 네이버 벌크 : bulk_div = 'N'
    // 핫클릭 : bulk_div = 'H'

    // /bulkn-ja
    // 출처는 3 이고, 벌크 구분 N
    // /bulkh-ja
    // 출처는 3이고, 벌크 구분  H

    // /bulkn-su
    // 출처는 60 이고, 벌크 구분 N
    // /bulkh-su
    // 출처는 60이고, 벌크 구분  H

    const [bulksParams, setBulkParams] = useState(initbulksParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정.
        const initPageParams = ({ path }) => {
            const pathName = path.split('/').reverse()[0];
            switch (pathName) {
                case 'bulkn-ja':
                    setBulkParams({
                        bulkPathName: pathName,
                        bulk_source: '3',
                        bulk_div: 'N',
                    });
                    break;
                case 'bulkn-su':
                    setBulkParams({
                        bulkPathName: pathName,
                        bulk_source: '61',
                        bulk_div: 'N',
                    });
                    break;
                case 'bulkh-ja':
                    setBulkParams({
                        bulkPathName: pathName,
                        bulk_source: '3',
                        bulk_div: 'H',
                    });
                    break;
                case 'bulkh-su':
                    setBulkParams({
                        bulkPathName: pathName,
                        bulk_source: '61',
                        bulk_div: 'H',
                    });
                    break;
                default:
                    // 없는 데이터 처리는 어떻게?
                    console.log('경로에서 페이지 데이터를 가지고 오지 못했습니다.');
            }
        };

        // 최초 로딩 이거나 path 변경 되었을때.
        if (bulksParams === initbulksParams || pathName.current !== match.path) {
            pathName.current = match.path;
            initPageParams(match);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

    // 파라미터가 변경 되면 store에 등록.
    useEffect(() => {
        const storeInit = ({ bulk_source, bulk_div, bulkPathName }) => {
            if (bulk_source !== '' && bulk_div !== '' && bulkPathName !== '') {
                dispatch(initializeParams(bulksParams));
            }
        };
        storeInit(bulksParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulksParams]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearSpecialCharCode());
        };
    }, [dispatch]);

    return <>{bulksParams.bulk_div !== '' && bulksParams.bulk_div === 'N' ? <Bulkn bulksParams={bulksParams} /> : <Bulkh bulksParams={bulksParams} />}</>;
};

const initbulksParams = {
    pathName: '', // 라우터 명.
    bulk_source: '', // 출처.
    bulk_div: '', // 벌크 구분
};

export default Bulks;
