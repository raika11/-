import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toastr } from 'react-redux-toastr';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel, MokaModal, MokaTable } from '@components';
import { GET_CODE_MGT_GRP_LIST, getCodeMgtGrpList, initialState, changeSearchOption } from '@store/codeMgt';
import { columnDefs } from './CodeMgtListAgGridColumns';

/**
 * 기타코드 그룹 AgGrid 컴포넌트
 */
const CodeMgtList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { total, grpList, search: storeSearch, loading } = useSelector((store) => ({
        total: store.codeMgt.grpTotal,
        grpList: store.codeMgt.grpList,
        search: store.codeMgt.grpSearch,
        loading: store.loading[GET_CODE_MGT_GRP_LIST],
    }));
    const [rowData, setRowData] = useState([]);
    const [search, setSearch] = useState(initialState.grpSearch);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getCodeMgtGrpList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * table
     */
    useEffect(() => {
        if (grpList.length > 0) {
            setRowData(grpList);
        } else {
            setRowData([]);
        }
    }, [grpList]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getCodeMgtGrpList(
                    changeSearchOption({
                        ...search,
                        [key]: value,
                        page: 0,
                    }),
                ),
            );
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClick = useCallback((grpList) => history.push(`/codeMgt/${grpList.grpCd}`), [history]);

    /**
     * 버튼 클릭
     */
    const handleAddClick = {};

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={() => setShowModal(true)}>
                    그룹 추가
                </Button>
            </div>
            {/* table */}
            <MokaTable
                agGridHeight={650}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(grpList) => grpList.grpCd}
                onRowClicked={handleRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={grpList.grpCd}
            />
            <MokaModal draggable show={showModal} onHide={() => setShowModal(false)} title="그룹">
                <MokaInputLabel label="코드그룹" placeholder="코드 그룹 아이디(영문으로 작성하세요)" required />
                <MokaInputLabel label="데이터셋명" placeholder="코드 그룹명" required />
                <Button
                    onClick={() => {
                        toastr.confirm('적용하시겠습니까?', {
                            onOk: () => {
                                setShowModal(false);
                            },
                            onCancle: () => {},
                            attention: false,
                        });
                    }}
                >
                    저장
                </Button>
                <Button>취소</Button>
            </MokaModal>
        </>
    );
};

export default CodeMgtList;
