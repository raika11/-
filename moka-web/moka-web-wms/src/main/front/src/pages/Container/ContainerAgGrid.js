import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import columnDefs from './ContainerAgGridColumns';
import { GET_CONTAINER_LIST, getContainerList, changeSearchOption } from '@store/container';

const ContainerAgGrid = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list, search, container, loading } = useSelector((store) => ({
        total: store.container.total,
        list: store.container.list,
        search: store.container.search,
        container: store.container.container,
        loading: store.loading[GET_CONTAINER_LIST],
    }));

    // state
    const [rowData, setRowData] = useState([]);

    /**
     * 컨테이너 등록 버튼 클릭
     */
    const handleAddClick = useCallback(() => history.push(`${match.path}/add`), [history, match.path]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((container) => history.push(`/container/${container.containerSeq}`), [history]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getContainerList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => ({
                    ...data,
                    onDelete,
                })),
            );
        } else {
            setRowData([]);
        }
    }, [list, onDelete]);

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="positive" onClick={handleAddClick} className="ft-12">
                    컨테이너 등록
                </Button>
            </div>
            {/* table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(container) => container.containerSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
                selected={container.containerSeq}
            />
        </>
    );
};

export default ContainerAgGrid;
