import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { MokaModal, MokaInput, MokaSearchInput, MokaIcon, MokaTable, MokaThumbTable } from '@components';
import { getTpZone, getTpSize } from '@store/codeMgt';
import { GET_TEMPLATE_LIST, getTemplateList, changeSearchOption, clearStore } from '@store/template';
import columnDefs from './TemplateListModalColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

export const defaultTemplateSearchType = [
    { id: 'all', name: '전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' },
    { id: 'templateBody', name: '템플릿본문' },
];

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 템플릿데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 템플릿아이디
     */
    selected: PropTypes.number,
};
const defaultProps = {};

/**
 * 템플릿 리스트 공통 모달
 */
const TemplateListModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected } = props;
    const dispatch = useDispatch();

    const { latestDomainId, domainList, tpZoneRows, tpSizeRows, search, total, list, error, loading } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        tpZoneRows: store.codeMgt.tpZoneRows,
        tpSizeRows: store.codeMgt.tpSizeRows,
        search: store.template.search,
        total: store.template.total,
        list: store.template.list,
        error: store.template.error,
        loading: store.loading[GET_TEMPLATE_LIST],
    }));

    // state
    const [listType, setListType] = useState('list');
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState({});

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    useEffect(() => {
        // unmount 시 스토어 초기화
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedTemplate);
        onHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        if (onClickCancle) onClickCancle();
        onHide();
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getTemplateList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const handleChangeTpSize = (e) => {
        if (e.target.value === 'all') {
            dispatch(
                changeSearchOption({
                    ...search,
                    widthMin: null,
                    widthMax: null,
                }),
            );
            return;
        }
        try {
            const { widthmin, widthmax } = e.target.selectedOptions[0].dataset;
            dispatch(
                changeSearchOption({
                    ...search,
                    widthMin: Number(widthmin),
                    widthMax: Number(widthmax),
                }),
            );
        } catch (err) {
            dispatch(
                changeSearchOption({
                    ...search,
                    widthMin: null,
                    widthMax: null,
                }),
            );
        }
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getTemplateList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((template) => {
        setSelectedTemplate(template);
        setSelected(template.templateSeq);
    }, []);

    useEffect(() => {
        // rowData 변경
        if (list.length > 0) {
            setRowData(
                list.map((data) => ({
                    ...data,
                    id: data.templateSeq,
                    name: data.templateName,
                    thumb: data.templateThumb,
                })),
            );
        } else {
            setRowData([]);
        }
    }, [list]);

    useEffect(() => {
        dispatch(
            changeSearchOption({
                ...search,
                domainId: latestDomainId,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, latestDomainId]);

    useEffect(() => {
        // 템플릿의 search.domainId 변경 시리스트 조회
        if (search.domainId) {
            dispatch(
                getTemplateList(
                    changeSearchOption({
                        ...search,
                        page: 0,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search.domainId]);

    useEffect(() => {
        dispatch(getTpZone());
        dispatch(getTpSize());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="템플릿 검색"
            size="md"
            buttons={[
                { text: '등록', onClick: handleClickSave },
                { text: '취소', variant: 'gray150', onClick: handleClickCancle },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    {/* 도메인 */}
                    <Col xs={7} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            className="w-100"
                            value={search.domainId || undefined}
                            onChange={(e) => {
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        domainId: e.target.value,
                                    }),
                                );
                            }}
                        >
                            {domainList.map((domain) => (
                                <option key={domain.domainId} value={domain.domainId}>
                                    {domain.domainName}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 템플릿 위치그룹 */}
                    <Col xs={5} className="p-0">
                        <MokaInput
                            as="select"
                            value={search.templateGroup}
                            onChange={(e) => {
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        templateGroup: e.target.value,
                                    }),
                                );
                            }}
                        >
                            <option value="all">위치그룹 전체</option>
                            {tpZoneRows.map((cd) => (
                                <option key={cd.dtlCd} value={cd.dtlCd}>
                                    {cd.cdNm}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 템플릿 사이즈 */}
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" value={search.templateWidth} onChange={handleChangeTpSize}>
                            <option value="all">사이즈 전체</option>
                            {tpSizeRows.map((cd) => (
                                <option key={cd.dtlCd} value={cd.dtlCd} data-widthmin={cd.cdNmEtc1} data-widthmax={cd.cdNmEtc2}>
                                    {cd.cdNm}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 검색조건 */}
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            value={search.searchType || undefined}
                            onChange={(e) => {
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        searchType: e.target.value,
                                    }),
                                );
                            }}
                        >
                            {defaultTemplateSearchType.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 키워드 */}
                    <Col xs={6} className="p-0">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        keyword: e.target.value,
                                    }),
                                );
                            }}
                            onSearch={handleSearch}
                        />
                    </Col>
                    {/* 버튼 그룹 */}
                    <Col xs={2} className="p-0 pl-2">
                        <Nav
                            as={ButtonGroup}
                            size="sm"
                            className="mr-auto h-100"
                            defaultActiveKey="list"
                            onSelect={(selectedKey) => {
                                setListType(selectedKey);
                            }}
                        >
                            <Nav.Link eventKey="list" as={Button} variant="gray150">
                                <MokaIcon iconName="fal-th-list" />
                            </Nav.Link>
                            <Nav.Link eventKey="thumbnail" as={Button} variant="gray150">
                                <MokaIcon iconName="fal-th-list" />
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            {listType === 'list' && (
                <MokaTable
                    agGridHeight={501}
                    error={error}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={selected}
                    pageSizes={MODAL_PAGESIZE_OPTIONS}
                />
            )}
            {listType === 'thumbnail' && (
                <MokaThumbTable
                    cardWidth={182}
                    tableHeight={501}
                    rowData={rowData}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={handleRowClicked}
                    selected={selected}
                    pageSizes={MODAL_PAGESIZE_OPTIONS}
                />
            )}
        </MokaModal>
    );
};

TemplateListModal.propTypes = propTypes;
TemplateListModal.defaultProps = defaultProps;

export default TemplateListModal;
