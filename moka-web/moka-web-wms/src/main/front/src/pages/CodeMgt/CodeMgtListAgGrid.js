import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaTable } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import {
    GET_CODE_MGT_GRP_LIST,
    clearCdList,
    getCodeMgtGrpList,
    getCodeMgtGrp,
    initialState,
    changeGrpSearchOption,
    deleteCodeMgtGrp,
    saveCodeMgtGrp,
    changeGrp,
    getCodeMgtGrpDuplicateCheck,
} from '@store/codeMgt';
import columnDefs from './CodeMgtListAgGridColumns';
import CodeMgtListModal from './modals/CodeMgtListModal';

/**
 * 기타코드 리스트 AgGrid
 */
const CodeMgtListAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { total, grpList, grp, search: storeSearch, cdSearch, loading } = useSelector(
        (store) => ({
            total: store.codeMgt.grpTotal,
            grpList: store.codeMgt.grpList,
            grp: store.codeMgt.grp,
            search: store.codeMgt.grpSearch,
            cdSearch: store.codeMgt.cdSearch,
            loading: store.loading[GET_CODE_MGT_GRP_LIST],
        }),
        shallowEqual,
    );
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

    useEffect(() => {
        search.secretYn === 'all'
            ? dispatch(getCodeMgtGrpList(changeGrpSearchOption({ ...search, secretYn: 'all' })))
            : dispatch(getCodeMgtGrpList(changeGrpSearchOption({ ...search, secretYn: 'N' })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.secretYn]);

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
    }, [grpList]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getCodeMgtGrpList(changeGrpSearchOption(temp)));
        },
        [dispatch, search],
    );

    const handleAddClick = () => {
        setSelectedData({});
        history.push(match.path);
        setShowAddModal(true);
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (grpList) => {
            history.push(`${match.path}/${grpList.grpCd}`);
            dispatch(getCodeMgtGrp(grpList.grpCd));
            dispatch(clearCdList());
        },
        [dispatch, history, match.path],
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
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success('수정하였습니다.');
                    } else {
                        toast.fail(header.message);
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
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success('등록하였습니다.');
                        history.push(`${match.path}/${codeGrp.grpCd}`);
                    } else {
                        toast.fail(header.message);
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
        messageBox.confirm('등록하시겠습니까?', () => {
            if (!codeGrp.grpSeq) {
                checkDuplicatedCodeMgtGrp(codeGrp);
            } else {
                updateGrp(codeGrp);
            }
        });
    };

    /**
     * 삭제 버튼 클릭
     * @param {object} codeGrp 코드그룹 데이터
     */
    const onClickDelete = (codeGrp) => {
        messageBox.confirm('선택하신 코드그룹의 하위 코드도 전부 삭제됩니다.\n코드그룹을 삭제하시겠습니까?', () => {
            dispatch(
                deleteCodeMgtGrp({
                    grpSeq: codeGrp.grpSeq,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success('삭제하였습니다.');
                            history.push(match.path);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        });
    };

    /**
     * 코드 그룹의 중복체크
     */
    const checkDuplicatedCodeMgtGrp = (codeGrp) => {
        dispatch(
            getCodeMgtGrpDuplicateCheck({
                grpCd: codeGrp.grpCd,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 중복 없음
                        if (!body) {
                            insertGrp(codeGrp, 'insert');
                        }
                        // 중복 있음
                        else {
                            toast.fail(header.message);
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    return (
        <>
            <Form.Row className="d-flex align-items-center justify-content-between mb-2">
                <MokaInput
                    as="checkbox"
                    id="secret-check"
                    className="ft-12"
                    style={{ lineHeight: '21px' }}
                    value={search.secretYn}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSearch({ ...search, secretYn: 'all' });
                        } else {
                            setSearch({ ...search, secretYn: 'N' });
                        }
                    }}
                    inputProps={{ label: '숨김 코드', custom: true }}
                />
                <Button variant="positive" onClick={handleAddClick} className="ft-12">
                    그룹 등록
                </Button>
            </Form.Row>

            {/* table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(grpList) => grpList.grpCd}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                displayPageNum={3}
                pageSizes={false}
                onChangeSearchOption={handleChangeSearchOption}
                selected={cdSearch.grpCd}
                preventRowClickCell={['edit']}
            />

            {/* 그룹 등록 모달 */}
            <CodeMgtListModal
                type="add"
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSave={onClickSave}
                onDelete={onClickDelete}
                data={selectedData}
                match={match}
            />

            {/* 그룹 수정 모달 */}
            <CodeMgtListModal
                type="edit"
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onSave={onClickSave}
                onDelete={onClickDelete}
                data={selectedData}
                match={match}
            />
        </>
    );
};

export default CodeMgtListAgGrid;
