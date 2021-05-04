import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { MokaTable } from '@/components';
import { getContainerListModal } from '@/store/container';
import columnDefs from './RelContainerAgGridColumns';
import toast from '@/utils/toastUtil';

/**
 * 레이아웃 검색 모달 AgGrid
 * 뉴스레터용으로 등록한 컨테이너 목록
 */
const RelContainerAgGrid = ({ search, total, setTotal, list, setList, loading, onChangeValue, handleRowClicked }) => {
    const dispatch = useDispatch();

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            onChangeValue(temp);
            dispatch(
                getContainerListModal({
                    search: temp,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setTotal(body.totalCnt);
                            setList(
                                body.list.map((c) => ({
                                    ...c,
                                    onClick: handleRowClicked,
                                })),
                            );
                        } else {
                            toast.fail(header.message);
                            setTotal(0);
                            setList([]);
                        }
                    },
                }),
            );
        },
        [search, onChangeValue, dispatch, setTotal, setList, handleRowClicked],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            onRowNodeId={(data) => data.containerSeq}
            rowData={list}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RelContainerAgGrid;
