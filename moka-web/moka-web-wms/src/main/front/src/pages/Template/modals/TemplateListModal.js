import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MODAL_PAGESIZE_OPTIONS, API_BASE_URL } from '@/constants';
import { MokaModal, MokaInput, MokaSearchInput, MokaTable, MokaTableTypeButton } from '@components';
import TemplateThumbTable, { propTypes as thumbTableProps } from '@pages/Template/components/TemplateThumbTable';
import { getTpZone, getTpSize } from '@store/codeMgt';
import { initialState, GET_TEMPLATE_LIST_MODAL, getTemplateListModal } from '@store/template';
import columnDefs from './TemplateListModalColumns';

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
    /**
     * 템플릿 위치
     */
    templateGroup: PropTypes.string,
    /**
     * 템플릿 사이즈
     */
    templateWidth: PropTypes.number,
    /**
     * 목록타입 list|thumbnail
     */
    listType: PropTypes.string,
    /**
     * 썸네일 리스트의 드롭다운 메뉴 리스트
     */
    menus: thumbTableProps.menus,
    /**
     * 검색 영역 위에 추가로 넣는 node
     */
    topAs: PropTypes.node,
};
const defaultProps = {};

/**
 * 템플릿 리스트 공통 모달
 * (템플릿 스토어 사용)
 */
const TemplateListModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, templateGroup, templateWidth, menus, listType: listTypeProp, topAs } = props;
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => auth);
    const { tpZoneRows, tpSizeRows } = useSelector(({ codeMgt }) => codeMgt);
    const loading = useSelector(({ loading }) => loading[GET_TEMPLATE_LIST_MODAL]);
    const UPLOAD_PATH_URL = useSelector(({ app }) => app.UPLOAD_PATH_URL);

    // state
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialState.search);
    const [listType, setListType] = useState(listTypeProp || 'list');
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState({});

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setListType('list');
        setTotal(0);
        setSearch(initialState.search);
        setSelected('');
        setSelectedTemplate({});
        onHide();
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedTemplate);
        handleHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        if (onClickCancle) onClickCancle();
        handleHide();
    };

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/template/${data.templateSeq}`);
    };

    /**
     * row 생성
     */
    const makeRowData = useCallback(
        (list) =>
            list.map((data) => {
                let thumb = data.templateThumb;
                if (thumb && thumb !== '') {
                    thumb = `${API_BASE_URL}${UPLOAD_PATH_URL}/${thumb}`;
                }
                return {
                    ...data,
                    id: data.templateSeq,
                    name: data.templateName,
                    thumb,
                    handleClickLink,
                };
            }),
        [UPLOAD_PATH_URL],
    );

    const responseCallback = useCallback(
        ({ header, body }) => {
            if (header.success) {
                setRowData(makeRowData(body.list));
                setTotal(body.totalCnt);
            } else {
                setRowData([]);
                setTotal(0);
            }
        },
        [makeRowData],
    );

    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'domainId') {
            const tmp = { ...search, domainId: value };
            setSearch(tmp);
            dispatch(
                getTemplateListModal({
                    search: tmp,
                    callback: responseCallback,
                }),
            );
        } else if (name === 'templateGroup') {
            setSearch({ ...search, templateGroup: value });
        } else if (name === 'searchType') {
            setSearch({ ...search, searchType: value });
        } else if (name === 'keyword') {
            setSearch({ ...search, keyword: value });
        }
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        const tmp = { ...search, page: 0 };
        setSearch(tmp);
        dispatch(
            getTemplateListModal({
                search: { ...search, page: 0 },
                callback: responseCallback,
            }),
        );
    }, [dispatch, responseCallback, search]);

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const handleChangeTpSize = (e) => {
        if (e.target.value === 'all') {
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: null,
                widthMax: null,
            });
            return;
        }
        try {
            const { widthmin, widthmax } = e.target.selectedOptions[0].dataset;
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: Number(widthmin),
                widthMax: Number(widthmax),
            });
        } catch (err) {
            setSearch({
                ...search,
                templateWidth: e.target.value,
                widthMin: null,
                widthMax: null,
            });
        }
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let tmp = { ...search, [key]: value };
            if (key !== 'page') tmp['page'] = 0;
            setSearch(tmp);
            dispatch(
                getTemplateListModal({
                    search: tmp,
                    callback: responseCallback,
                }),
            );
        },
        [dispatch, responseCallback, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((template) => {
        setSelectedTemplate(template);
        setSelected(template.templateSeq);
    }, []);

    /**
     * 체크박스 변경
     */
    const handleSelectionChanged = useCallback(
        (selectedNodes) => {
            if (selectedNodes.length > 0) {
                const sd = selectedNodes[0].data;
                if (sd.templateSeq !== selected) {
                    setSelectedTemplate(sd);
                    setSelected(sd.templateSeq);
                }
            }
        },
        [selected],
    );

    useEffect(() => {
        setSelected(defaultSelected);
    }, [defaultSelected]);

    useEffect(() => {
        if (show) {
            let tmp = {
                ...initialState.search,
                domainId: latestDomainId,
                templateGroup,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            };

            if (templateWidth) {
                const tpSize = tpSizeRows.find((size) => Number(size.cdNmEtc1) <= templateWidth && Number(size.cdNmEtc2) >= templateWidth);
                if (tpSize) {
                    tmp.templateWidth = tpSize.dtlCd;
                    tmp.widthMin = tpSize.cdNmEtc1;
                    tmp.widthMax = tpSize.cdNmEtc2;
                }
            }

            dispatch(
                getTemplateListModal({
                    search: { ...tmp, page: 0 },
                    callback: responseCallback,
                }),
            );
            setSearch(tmp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestDomainId, tpSizeRows, show, templateGroup, templateWidth]);

    useEffect(() => {
        if (show) {
            if (!tpSizeRows) dispatch(getTpSize());
            if (!tpZoneRows) dispatch(getTpZone());
        }
    }, [dispatch, show, tpSizeRows, tpZoneRows]);

    return (
        <MokaModal
            width={680}
            show={show}
            onHide={handleHide}
            title="템플릿 검색"
            size="lg"
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            draggable
            centered
        >
            {topAs}
            <Form className="mb-14">
                <Form.Row className="mb-2">
                    {/* 도메인 */}
                    <Col xs={7} className="p-0 pr-2">
                        <MokaInput as="select" value={search.domainId} name="domainId" onChange={handleChangeValue}>
                            {domainList.map((domain) => (
                                <option key={domain.domainId} value={domain.domainId}>
                                    {domain.domainName}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 템플릿 위치그룹 */}
                    <Col xs={5} className="p-0">
                        <MokaInput as="select" value={search.templateGroup} name="templateGroup" onChange={handleChangeValue}>
                            <option value="all">위치그룹 전체</option>
                            {tpZoneRows &&
                                tpZoneRows.map((cd) => (
                                    <option key={cd.dtlCd} value={cd.dtlCd}>
                                        {cd.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </Col>
                </Form.Row>
                <Form.Row>
                    {/* 템플릿 사이즈 */}
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="select" value={search.templateWidth} onChange={handleChangeTpSize}>
                            <option value="all">사이즈 전체</option>
                            {tpSizeRows &&
                                tpSizeRows.map((cd) => (
                                    <option key={cd.dtlCd} value={cd.dtlCd} data-widthmin={cd.cdNmEtc1} data-widthmax={cd.cdNmEtc2}>
                                        {cd.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </Col>
                    {/* 검색조건 */}
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" value={search.searchType} name="searchType" onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={7} className="p-0 d-flex">
                        {/* 키워드 */}
                        <MokaSearchInput className="pr-2 flex-fill" value={search.keyword} name="keyword" onChange={handleChangeValue} onSearch={handleSearch} />
                        {/* 버튼 그룹 */}
                        <MokaTableTypeButton defaultActiveKey={listType} onSelect={(selectedKey) => setListType(selectedKey)} />
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            {listType === 'list' && (
                <MokaTable
                    agGridHeight={501}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    onSelectionChanged={handleSelectionChanged}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={selected}
                    pageSizes={MODAL_PAGESIZE_OPTIONS}
                    preventRowClickCell={['link']}
                    suppressRefreshCellAfterUpdate
                />
            )}
            {listType === 'thumbnail' && (
                <TemplateThumbTable
                    cardWidth={198}
                    cardHeight={198}
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
                    menus={menus}
                />
            )}
        </MokaModal>
    );
};

TemplateListModal.propTypes = propTypes;
TemplateListModal.defaultProps = defaultProps;

export default TemplateListModal;
