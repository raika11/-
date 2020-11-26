import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MODAL_PAGESIZE_OPTIONS, API_BASE_URL } from '@/constants';
import { MokaModal, MokaInput, MokaSearchInput, MokaTable, MokaThumbTable, MokaTableTypeButton } from '@components';
import { getTpZone, getTpSize } from '@store/codeMgt';
import { initialState, GET_TEMPLATE_LIST, getTemplateList, changeSearchOption, clearStore } from '@store/template';
import columnDefs from './TemplateListModalColumns';
import { defaultTemplateSearchType } from '@pages/commons';

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
};
const defaultProps = {};

/**
 * 템플릿 리스트 공통 모달
 * (템플릿 스토어 사용)
 */
const TemplateListModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, templateGroup, templateWidth } = props;
    const dispatch = useDispatch();

    const { latestDomainId, domainList, tpZoneRows, tpSizeRows, search, total, list, error, loading, UPLOAD_PATH_URL } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        tpZoneRows: store.codeMgt.tpZoneRows,
        tpSizeRows: store.codeMgt.tpSizeRows,
        search: store.template.search,
        total: store.template.total,
        list: store.template.list,
        error: store.template.error,
        loading: store.loading[GET_TEMPLATE_LIST],
        UPLOAD_PATH_URL: store.app.UPLOAD_PATH_URL,
    }));

    // state
    const [listType, setListType] = useState('list');
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [loadCnt, setLoadCnt] = useState(0);

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        dispatch(clearStore());
        setListType('list');
        setLoadCnt(0);
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
                    templateWidth: e.target.value,
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
                    templateWidth: e.target.value,
                    widthMin: Number(widthmin),
                    widthMax: Number(widthmax),
                }),
            );
        } catch (err) {
            dispatch(
                changeSearchOption({
                    ...search,
                    templateWidth: e.target.value,
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
        // rowData 변경
        if (list.length > 0) {
            setRowData(
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
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [UPLOAD_PATH_URL, list]);

    useEffect(() => {
        if (show) {
            if (templateGroup || templateWidth) {
                setListType('thumbnail');
                let ts = {
                    ...initialState.search,
                    domainId: latestDomainId,
                    templateGroup: templateGroup,
                    size: MODAL_PAGESIZE_OPTIONS[0],
                    page: 0,
                };
                if (templateWidth) {
                    const tpSize = tpSizeRows.find((size) => Number(size.cdNmEtc1) <= templateWidth && Number(size.cdNmEtc2) >= templateWidth);
                    if (tpSize) {
                        ts.templateWidth = tpSize.dtlCd;
                        ts.widthMin = tpSize.cdNmEtc1;
                        ts.widthMax = tpSize.cdNmEtc2;
                    }
                }
                dispatch(changeSearchOption(ts));
            } else {
                dispatch(
                    changeSearchOption({
                        ...initialState.search,
                        domainId: latestDomainId,
                        size: MODAL_PAGESIZE_OPTIONS[0],
                        page: 0,
                    }),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestDomainId, tpSizeRows, show, templateGroup, templateWidth]);

    useEffect(() => {
        if (loadCnt > 1) return;
        // 템플릿의 search.domainId 변경시 리스트 조회
        if (search.domainId) {
            dispatch(
                getTemplateList(
                    changeSearchOption({
                        ...search,
                        page: 0,
                    }),
                ),
            );
            setLoadCnt(loadCnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search.domainId]);

    useEffect(() => {
        if (tpSizeRows.length < 1) dispatch(getTpSize());
        if (tpZoneRows.length < 1) dispatch(getTpZone());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="select" value={search.templateWidth} onChange={handleChangeTpSize} className="ft-12">
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
                            className="ft-12"
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
                    <Col xs={7} className="p-0 d-flex">
                        {/* 키워드 */}
                        <MokaSearchInput
                            className="pr-2 flex-fill"
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
                        {/* 버튼 그룹 */}
                        <MokaTableTypeButton
                            onSelect={(selectedKey) => {
                                setListType(selectedKey);
                            }}
                        />
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
                    onSelectionChanged={handleSelectionChanged}
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
                    cardWidth={209}
                    cardHeight={209}
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
