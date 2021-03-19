import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal } from '@/components';
import {
    initialState,
    GET_MAPPING_CODE_LIST,
    getMappingCodeList,
    changeModalSearchOption,
    getMappingCode,
    clearMappingCode,
    clearMappingList,
    clearMappingSearch,
} from '@store/articleSource';
import AgGrid from '../components/CodeMappingAgGrid';
import Edit from '../components/CodeMappingEdit';

const CodeMappingModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();

    const mappingList = useSelector((store) => store.articleSource.mappingList);
    const mappingTotal = useSelector((store) => store.articleSource.mappingTotal);
    const mappingSearch = useSelector((store) => store.articleSource.mappingSearch);
    const loading = useSelector((store) => store.loading[GET_MAPPING_CODE_LIST]);
    const mappingCode = useSelector((store) => store.articleSource.mappingCode);

    const [showEdit, setShowEdit] = useState(false);
    const [search, setSearch] = useState(initialState.mappingSearch);

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        dispatch(clearMappingCode());
        dispatch(clearMappingList());
        dispatch(clearMappingSearch());
        setShowEdit(false);
        onHide();
    };

    /**
     * 신규 등록 버튼
     */
    const handleClickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(clearMappingCode());
        setShowEdit(true);
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            dispatch(
                getMappingCode({
                    sourceCode: data.sourceCode,
                    seqNo: row.seqNo,
                }),
            );
        },
        [data.sourceCode, dispatch],
    );

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getMappingCodeList(changeModalSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setSearch(mappingSearch);
    }, [mappingSearch]);

    useEffect(() => {
        if (mappingCode.seqNo) {
            setShowEdit(true);
        }
    }, [mappingCode.seqNo]);

    return (
        <MokaModal
            show={show}
            onHide={handleHide}
            size="lg"
            headerClassName="p-3 border border-top-0 border-left-0 border-right-0"
            bodyClassName="d-flex flex-column"
            titleAs={
                <div className="w-100 d-flex align-items-center ft-16 font-weight-bold justify-content-center color-dark">
                    <p className="mb-0 mr-2">매체 코드 : {data.sourceCode}</p>
                    <p className="mb-0 mr-2">매체명 : {data.sourceName}</p>
                    {/* <Button variant="outline-table-btn" onClick={handleClickAdd} style={{ position: 'absolute', left: 385 }}>
                        등록
                    </Button> */}
                </div>
            }
            width={900}
            id="code_mapping_modal"
            draggable
        >
            <Container fluid className="p-0 flex-fill">
                <Row className="m-0">
                    <Col xs={6} className="p-0 pt-14 pr-gutter">
                        <div className="mb-14 d-flex justify-content-end">
                            <Button variant="outline-table-btn" onClick={handleClickAdd}>
                                등록
                            </Button>
                        </div>
                        <AgGrid
                            show={show}
                            data={data}
                            loading={loading}
                            mappingTotal={mappingTotal}
                            mappingList={mappingList}
                            search={search}
                            mappingCode={mappingCode}
                            handleRowClicked={handleRowClicked}
                            handleChangeSearchOption={handleChangeSearchOption}
                        />
                    </Col>
                    <Col xs={6} className="p-0 pt-2">
                        {showEdit && <Edit data={data} mappingCode={mappingCode} onHide={handleHide} />}
                    </Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default CodeMappingModal;
