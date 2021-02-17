import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { initialState, getGrpModal, clearDtlList } from '@store/codeMgt';
import Search from './DtlSearch';
import AgGrid from './DtlAgGrid';

/**
 * 상세코드 목록
 */
const DtlList = () => {
    const dispatch = useDispatch();
    const { grpCd } = useParams();
    const [grp, setGrp] = useState(initialState.grp.grp); // 등록 시 넘겨줘야하는 codeMgtGrp 데이터 조회

    useEffect(() => {
        return () => {
            dispatch(clearDtlList());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(
            getGrpModal({
                grpCd,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setGrp(body);
                    }
                },
            }),
        );
    }, [grpCd, dispatch]);

    return (
        <React.Fragment>
            <Search grpCd={grpCd} grp={grp} />
            <AgGrid grpCd={grpCd} grp={grp} />
        </React.Fragment>
    );
};

export default DtlList;
