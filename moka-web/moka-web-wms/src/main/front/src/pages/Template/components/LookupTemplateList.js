import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ITEM_PG, ITEM_CT, ITEM_AP, API_BASE_URL, ITEM_TP } from '@/constants';
import { MokaCard, MokaInput, MokaSearchInput, MokaTableTypeButton, MokaTable } from '@components';
import { TemplateThumbTable } from '@pages/Template/components';
import { getTpZone, getTpSize } from '@store/codeMgt';
import { getTemplateLookupList, changeLookupSearchOption, initialState, clearLookup, GET_TEMPLATE_LOOKUP_LIST } from '@store/template';
import columnDefs from './LookupTemplateListColumns';
import { TemplateHtmlModal } from '@pages/Template/modals';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_CT, ITEM_AP, ITEM_PG]),
    /**
     * seq
     */
    seq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
    /**
     * row의 append 버튼 클릭 이벤트
     */
    onAppend: PropTypes.func,
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 템플릿 리스트
 */
const LookupTemplateList = (props) => {
    const { seq, seqType, show, onAppend } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_TEMPLATE_LOOKUP_LIST]);
    const UPLOAD_PATH_URL = useSelector(({ app }) => app.UPLOAD_PATH_URL);
    const { tpSizeRows, tpZoneRows } = useSelector(({ codeMgt }) => ({
        tpSizeRows: codeMgt.tpSizeRows,
        tpZoneRows: codeMgt.tpZoneRows,
    }));
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { search: storeSearch, list, total } = useSelector(({ template }) => template.lookup);
    const [search, setSearch] = useState(initialState.lookup.search);
    const [searchTypeList, setSearchTypeList] = useState(initialState.searchTypeList);
    const [listType, setListType] = useState('list');
    const [rowData, setRowData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getTemplateLookupList(changeLookupSearchOption(temp)));
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        handleChangeSearchOption({ key: 'page', value: 0 });
    };

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const handleChangeTpSize = (e) => {
        if (e.target.value === 'all') {
            setSearch({
                ...search,
                widthMin: null,
                widthMax: null,
                templateWidth: e.target.value,
            });
            return;
        }
        try {
            const { widthmin, widthmax } = e.target.selectedOptions[0].dataset;
            setSearch({
                ...search,
                widthMin: Number(widthmin),
                widthMax: Number(widthmax),
                templateWidth: e.target.value,
            });
        } catch (err) {
            setSearch({
                ...search,
                widthMin: null,
                widthMax: null,
                templateWidth: 'all',
            });
        }
    };

    /**
     * row클릭
     * @param {object} data row data
     */
    const handleRowClicked = (data) => {
        setSelected(data);
        setShowModal(true);
    };

    /**
     * 태그 삽입 버튼 클릭
     * @param {object} data row data
     */
    const handleClickAppend = useCallback(
        (data) => {
            if (onAppend) {
                onAppend(data, ITEM_TP);
            }
        },
        [onAppend],
    );

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/template/${data.templateSeq}`);
    };

    useEffect(() => {
        return () => {
            dispatch(clearLookup());
        };
    }, [dispatch]);

    useEffect(() => {
        // row 생성
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
                    handleClickAppend,
                    handleClickLink,
                };
            }),
        );
    }, [UPLOAD_PATH_URL, handleClickAppend, list]);

    useEffect(() => {
        if (seqType === ITEM_PG) {
            setSearchTypeList(
                produce(initialState.searchTypeList, (draft) => {
                    draft.splice(1, 0, { id: 'pageSeq', name: '페이지ID' });
                }),
            );
        } else if (seqType === ITEM_AP) {
            setSearchTypeList(
                produce(initialState.searchTypeList, (draft) => {
                    draft.splice(1, 0, { id: 'artPageSeq', name: '아티클페이지ID' });
                }),
            );
        } else if (seqType === ITEM_CT) {
            setSearchTypeList(
                produce(initialState.searchTypeList, (draft) => {
                    draft.splice(1, 0, { id: 'containerSeq', name: '컨테이너ID' });
                }),
            );
        }
    }, [seqType]);

    useEffect(() => {
        if (show) {
            dispatch(
                getTemplateLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_PG ? 'pageSeq' : seqType === ITEM_AP ? 'artPageSeq' : seqType === ITEM_CT ? 'containerSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    useEffect(() => {
        if (show) {
            if (!tpSizeRows) dispatch(getTpSize());
            if (!tpZoneRows) dispatch(getTpZone());
        }
    }, [dispatch, show, tpSizeRows, tpZoneRows]);

    return (
        <MokaCard title="관련 템플릿" bodyClassName="d-flex flex-column">
            <Form className="mb-14">
                <Form.Row className="mb-2">
                    {/* 템플릿 위치그룹 */}
                    <Col xs={7} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            value={search.templateGroup}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    templateGroup: e.target.value,
                                });
                            }}
                        >
                            <option value="all">위치그룹 전체</option>
                            {tpZoneRows &&
                                tpZoneRows.map((cd) => (
                                    <option key={cd.dtlCd} value={cd.dtlCd}>
                                        {cd.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </Col>
                    {/* 템플릿 사이즈 */}
                    <Col xs={5} className="p-0">
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
                </Form.Row>
                <Form.Row>
                    {/* 검색조건 */}
                    <div className="mr-2 flex-shrink-0">
                        <MokaInput
                            as="select"
                            value={search.searchType}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    {/* 키워드 */}
                    <MokaSearchInput
                        className="flex-fill"
                        value={search.keyword}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                keyword: e.target.value,
                            });
                        }}
                        onSearch={handleSearch}
                    />
                </Form.Row>
            </Form>

            {/* 버튼 그룹 */}
            <div className="d-flex mb-14">
                <MokaTableTypeButton onSelect={(selectedKey) => setListType(selectedKey)} />
                <div className="pt-0">
                    <Button variant="positive" onClick={() => window.open('/template/add')}>
                        템플릿 등록
                    </Button>
                </div>
            </div>

            {/* ag-grid table */}
            {listType === 'list' && (
                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={3}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['append', 'link']}
                    selected={selected.templateSeq}
                />
            )}
            {listType === 'thumbnail' && (
                <TemplateThumbTable
                    className="overflow-hidden flex-fill"
                    rowData={rowData}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={3}
                    cardWidth={170}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={handleRowClicked}
                    selected={selected.templateSeq}
                    menus={[
                        { title: '태그삽입', onClick: handleClickAppend },
                        { title: '새창열기', onClick: handleClickLink },
                    ]}
                />
            )}

            <TemplateHtmlModal
                templateSeq={selected.templateSeq}
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelected({});
                }}
            />
        </MokaCard>
    );
};

LookupTemplateList.propTypes = propTypes;
LookupTemplateList.defaultProps = defaultProps;

export default LookupTemplateList;
