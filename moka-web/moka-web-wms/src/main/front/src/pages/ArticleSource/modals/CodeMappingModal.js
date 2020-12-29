import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    const handleClickAdd = () => {
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
            size="xl"
            headerClassName="p-3 border border-top-0 border-left-0 border-right-0"
            bodyClassName="p-2"
            titleAs={
                <div className="w-100 d-flex align-items-center">
                    <p className="mb-0 mr-3 ft-12">매체 코드 : {data.sourceCode}</p>
                    <p className="mb-0 mr-3 ft-12">매체명 : {data.sourceName}</p>
                </div>
            }
            width={720}
            height={600}
            id="code_mapping_modal"
            draggable
        >
            <Container fluid>
                <Row>
                    <Col xs={5}>
                        <AgGrid
                            show={show}
                            data={data}
                            loading={loading}
                            mappingTotal={mappingTotal}
                            mappingList={mappingList}
                            search={search}
                            mappingCode={mappingCode}
                            handleClickAdd={handleClickAdd}
                            handleRowClicked={handleRowClicked}
                            handleChangeSearchOption={handleChangeSearchOption}
                        />
                    </Col>
                    <Col xs={7}>{showEdit && <Edit data={data} mappingCode={mappingCode} onHide={handleHide} />}</Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default CodeMappingModal;
