import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ITEM_PG, ITEM_CT, ITEM_AP } from '@/constants';
import { MokaCard, MokaInput, MokaSearchInput, MokaTable } from '@components';
import columnDefs from './LookupAdListColumns';

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
 * seq, seqType을 검색조건으로 사용하는 Lookup 광고 리스트
 */
const LookupAdList = (props) => {
    // const { seq, seqType, show, onAppend } = props;
    // const { onAppend } = props;
    // const dispatch = useDispatch();

    // state
    const [search, setSearch] = useState({});
    const [searchTypeList] = useState([]);
    const [rowData] = useState([]);
    const [selected, setSelected] = useState({});

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {};

    /**
     * 검색
     */
    const handleSearch = () => {
        handleChangeSearchOption({ key: 'page', value: 0 });
    };

    /**
     * row클릭
     * @param {object} data row data
     */
    const handleRowClicked = (data) => {
        setSelected(data);
    };

    /**
     * 태그 삽입 버튼 클릭
     * @param {object} data row data
     */
    // const handleClickAppend = useCallback(
    //     (data) => {
    //         if (onAppend) {
    //             onAppend(data, ITEM_TP);
    //         }
    //     },
    //     [onAppend],
    // );

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    // const handleClickLink = (data) => {
    //     window.open(`/template/${data.templateSeq}`);
    // };

    // useEffect(() => {
    //     // row 생성
    //     setRowData(
    //         list.map((data) => {
    //             let thumb = data.templateThumb;
    //             if (thumb && thumb !== '') {
    //                 thumb = `${API_BASE_URL}${UPLOAD_PATH_URL}/${thumb}`;
    //             }
    //             return {
    //                 ...data,
    //                 id: data.templateSeq,
    //                 name: data.templateName,
    //                 thumb,
    //                 handleClickAppend,
    //                 handleClickLink,
    //             };
    //         }),
    //     );
    // }, [UPLOAD_PATH_URL, handleClickAppend, list]);

    // useEffect(() => {
    //     if (seqType === ITEM_PG) {
    //         setSearchTypeList(
    //             produce(initialState.searchTypeList, (draft) => {
    //                 draft.splice(1, 0, { id: 'pageSeq', name: '페이지ID' });
    //             }),
    //         );
    //     } else if (seqType === ITEM_AP) {
    //         setSearchTypeList(
    //             produce(initialState.searchTypeList, (draft) => {
    //                 draft.splice(1, 0, { id: 'artPageSeq', name: '아티클페이지ID' });
    //             }),
    //         );
    //     } else if (seqType === ITEM_CT) {
    //         setSearchTypeList(
    //             produce(initialState.searchTypeList, (draft) => {
    //                 draft.splice(1, 0, { id: 'containerSeq', name: '컨테이너ID' });
    //             }),
    //         );
    //     }
    // }, [seqType]);

    return (
        <MokaCard title="관련 광고" bodyClassName="d-flex flex-column">
            <Form.Row className="mb-14">
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
                        <option value="">수정필요</option>
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

            {/* 버튼 그룹 */}
            <div className="d-flex justify-content-end mb-14">
                <Button variant="positive" onClick={() => window.open('/template/add')}>
                    광고 등록
                </Button>
            </div>

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(ad) => ad.adSeq}
                onRowClicked={handleRowClicked}
                loading={false}
                total={0}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['append', 'link']}
                selected={selected.adSeq}
            />
        </MokaCard>
    );
};

LookupAdList.propTypes = propTypes;
LookupAdList.defaultProps = defaultProps;

export default LookupAdList;
