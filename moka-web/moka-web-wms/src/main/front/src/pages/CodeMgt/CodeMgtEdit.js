import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaInput, MokaTable, MokaModal, MokaInputLabel } from '@components';
import { GET_CODE_MGT_LIST, getCodeMgtList, initialState, changeSearchOption } from '@store/codeMgt';
import { columnDefs } from './CodeMgtEditAgGridColumns';

const CodeMgtEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { grpCd } = useParams();
    const { cdList, total, search: storeSearch, loading } = useSelector((store) => ({
        cdList: store.codeMgt.cdList,
        total: store.codeMgt.cdTotal,
        search: store.codeMgt.cdSearch,
        loading: store.loading[GET_CODE_MGT_LIST],
    }));
    const [rowData, setRowData] = useState([]);
    const [search, setSearch] = useState(initialState.cdSearch);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (grpCd !== search.grpCd) {
            dispatch(getCodeMgtList(changeSearchOption({ ...search, grpCd })));
        }
    }, [dispatch, grpCd, search]);

    /**
     * table
     */
    useEffect(() => {
        if (grpCd) {
            setRowData(
                cdList.map((data) => ({
                    ...data,
                    id: data.seqNo,
                    seqNo: data.seqNo,
                    grpCd: grpCd,
                    dtlCd: data.dtlCd,
                    cdOrd: data.cdOrd,
                    cdNm: String(data.cdNm) || '',
                    cdEngNm: String(data.cdEngNm),
                    usedYn: data.usedYn,
                    cdComment: data.cdComment,
                    cdNmEtc1: data.cdNmEtc1 || '',
                    cdNmEtc2: data.cdNmEtc2 || '',
                    cdNmEtc3: data.cdNmEtc3 || '',
                })),
            );
        }
    }, [cdList, grpCd]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClick = useCallback((cdList) => history.push(`/codeMgt/${grpCd}/${cdList.seqNo}`), [grpCd, history]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getCodeMgtList(
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

    return (
        <>
            <Form.Row className="m-0 mb-2">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select">
                        <option value="dtlCd">코드</option>
                        <option value="cdNm">코드명</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput value={null} onChange={handleChangeSearchOption} onSearch={null} />
                </Col>
                <Col xs={1} className="p-0">
                    <Button variant="dark" onClick={() => setShowModal(true)}>
                        코드 추가
                    </Button>
                </Col>
            </Form.Row>
            {/* table */}
            <MokaTable
                agGridHeight={650}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(cdList) => cdList.seqNo}
                onRowClicked={handleRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={cdList.seqNo}
            />
            <MokaModal draggable show={showModal} onHide={() => setShowModal(false)} title="코드 추가">
                <MokaInputLabel label="코드그룹" placeholder="" />
                <MokaInputLabel label="코드" />
                <MokaInputLabel label="코드명" />
                <MokaInputLabel label="영문명" />
                <MokaInputLabel label="비고" />
                <MokaInputLabel label="기타1" />
                <MokaInputLabel label="기타2" />
                <MokaInputLabel label="기타3" />
                <MokaInputLabel label="순서" />
                <MokaInputLabel label="사용여부" />
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

export default CodeMgtEdit;
