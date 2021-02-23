import React, { useEffect, useState, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { clearStore, initializeParams } from '@store/bulks';
import { clearSpecialCharCode } from '@store/codeMgt';
import { BULKS_CODE } from '@/constants';

const Bulkh = React.lazy(() => import('./Bulkh'));
const Bulkn = React.lazy(() => import('./Bulkn'));

const Bulks = ({ match }) => {
    const dispatch = useDispatch();
    const pathName = useRef(match.path);

    const [bulksParams, setBulkParams] = useState(initbulksParams);

    useEffect(() => {
        // 라우터로 기본 공통 구분값 설정.
        const initPageParams = ({ path }) => {
            const pathName = path.split('/').reverse()[0];
            setBulkParams({
                bulkPathName: pathName,
                ...BULKS_CODE[pathName],
            });
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
