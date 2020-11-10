import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';

import { MokaTable } from '@components';
import { notification, toastr } from '@utils/toastUtil';
import {
    GET_CODE_MGT_GRP_LIST,
    clearGrp,
    clearCdList,
    getCodeMgtGrpList,
    getCodeMgtGrp,
    initialState,
    changeSearchOption,
    deleteCodeMgtGrp,
    saveCodeMgtGrp,
    changeGrp,
} from '@store/codeMgt';
import { columnDefs } from './CodeMgtListAgGridColumns';
import CodeMgtListModal from './modals/CodeMgtListModal';

/**
 * 기타코드 리스트 AgGrid
 */
const CodeMgtListAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { total, grpList, grp, search: storeSearch, cdSearch, loading } = useSelector((store) => ({
        total: store.codeMgt.grpTotal,
        grpList: store.codeMgt.grpList,
        grp: store.codeMgt.grp,
        search: store.codeMgt.grpSearch,
        cdSearch: store.codeMgt.cdSearch,
        loading: store.loading[GET_CODE_MGT_GRP_LIST],
    }));
    const [rowData, setRowData] = useState([]);
    const [search, setSearch] = useState(initialState.grpSearch);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedData, setSelectedData] = useState({});

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
            setRowData(
                grpList.map((data) => ({
                    ...data,
                    grpSeq: data.seqNo,
                    edit: (data) => {
                        setShowEditModal(true);
                        setSelectedData(data);
                    },
                })),
            );
        } else {
            setRowData([]);
        }
    }, [dispatch, grpList]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getCodeMgtGrpList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    const handleAddClick = () => {
        dispatch(clearGrp());
        dispatch(clearCdList());
        history.push('/codeMgt');
        setShowAddModal(true);
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClick = useCallback(
        (grpList) => {
            history.push(`/codeMgt/${grpList.grpCd}`);
            dispatch(getCodeMgtGrp(grpList.grpCd));
            dispatch(clearCdList());
        },
        [dispatch, history],
    );

    /**
     * 그룹 수정
     * @param {object} codeGrp 그룹
     */
    const updateGrp = (codeGrp) => {
        dispatch(
            saveCodeMgtGrp({
                type: 'update',
                actions: [
                    changeGrp({
                        ...grp,
                        ...codeGrp,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 그룹 등록
     * @param {object} codeGrp 그룹
     */
    const insertGrp = (codeGrp) => {
        dispatch(
            saveCodeMgtGrp({
                type: 'insert',
                actions: [
                    changeGrp({
                        ...grp,
                        ...codeGrp,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        notification('success', '등록하였습니다.');
                        history.push(`/codeMgt/${codeGrp.grpCd}`);
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param {object} codeGrp 코드그룹 데이터
     */
    const onClickSave = (codeGrp) => {
        toastr.confirm('적용하시겠습니까?', {
            onOk: () => {
                if (!codeGrp.grpSeq) {
                    insertGrp(codeGrp);
                } else {
                    updateGrp(codeGrp);
                }
            },
            onCancel: () => {},
            attention: false,
        });
    };

    /**
     * 삭제 버튼 클릭
     * @param {object} codeGrp 코드그룹 데이터
     */
    const onClickDelete = (codeGrp) => {
        toastr.confirm(
            <>
                <p>선택하신 코드그룹의 하위 코드도 전부 삭제됩니다.</p>
                <p>코드그룹을 삭제하시겠습니까?</p>
            </>,
            {
                onOk: () => {
                    dispatch(
                        deleteCodeMgtGrp({
                            grpSeq: codeGrp.grpSeq,
                            callback: (response) => {
                                if (response.header.success) {
                                    notification('success', '삭제하였습니다.');
                                    history.push('/codeMgt');
                                } else {
                                    notification('warning', response.header.message);
                                }
                            },
                        }),
                    );
                },
                onCancel: () => {},
                attention: false,
            },
        );
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={handleAddClick}>
                    그룹 추가
                </Button>
            </div>
            {/* table */}
            <MokaTable
                agGridHeight={693}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(grpList) => grpList.grpCd}
                onRowClicked={handleRowClick}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                showTotalString={false}
                displayPageNum={3}
                pageSizes={false}
                onChangeSearchOption={handleChangeSearchOption}
                selected={cdSearch.grpCd}
                preventRowClickCell={['edit']}
                paginationClassName="justify-content-center"
            />
            <CodeMgtListModal type="add" show={showAddModal} onHide={() => setShowAddModal(false)} onSave={onClickSave} onDelete={onClickDelete} data={selectedData} />
            <CodeMgtListModal type="edit" show={showEditModal} onHide={() => setShowEditModal(false)} onSave={onClickSave} onDelete={onClickDelete} data={selectedData} />
        </>
    );
};

export default CodeMgtListAgGrid;
