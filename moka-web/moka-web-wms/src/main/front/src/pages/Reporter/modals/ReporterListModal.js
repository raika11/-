import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, changeSearchOption, GET_REPORTER_LIST_MODAL, getReporterListModal } from '@store/reporter';
import { columnDefs } from './ReporterModalAgGridColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import Button from 'react-bootstrap/Button';
export const { searchTypeList } = initialState;

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,
    /**
     * 제외 데이터셋아이디
     */
    exclude: PropTypes.any,
    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const ReporterMgrSearchModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, exclude } = props;
    const dispatch = useDispatch();
    const { keyword, loading } = useSelector((store) => ({
        keyword: store.reporter.search.keyword,
        loading: store.loading[GET_REPORTER_LIST_MODAL],
    }));

    //console.log('sssssssssssssssselected', data);

    // state
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [selectedReporter, setSelectedReporter] = useState({});
    const [rowData, setRowData] = useState([]);
    const [cnt, setCnt] = useState(0);

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = ({ header, body }) => {
        if (header.success) {
            setRowData(
                body.list.map((data) => ({
                    ...data,
                    onClickSave,
                    //autoCreateYnName: data.autoCreateYn === 'Y' ? '자동형' : '수동형',
                })),
            );
            setTotal(body.totalCnt);
            setError(initialState.error);
        } else {
            setRowData([]);
            setTotal(initialState.total);
            setError(body);
        }
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRowData([]);
        setTotal(initialState.total);
        setError(null);
        setCnt(0);
        onHide();
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        //if (onClickSave) onClickSave(selectedReporter, handleHide);

        if (onClickSave) {
        }

        console.log();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        setSearch(initialState.search);

        // if (onClickSave) {
        //     onClickSave(selectedReporter);
        // }
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedReporter(data);
    }, []);

    /**
     * 검색
     */
    const handleSearch = (search) => {
        dispatch(
            getReporterListModal({
                search: { ...search, keyword: keyword, size: 100, page: 0, exclude },
                callback: responseCallback,
            }),
        );
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        setSearch(temp);
    };

    useEffect(() => {
        if (show && cnt < 1) {
            handleSearch({
                ...search,
                keyword: keyword,
                size: 100,
                page: 0,
                exclude,
            });
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, show, exclude, cnt]);

    return (
        <MokaModal show={show} onHide={handleHide} title="기자 검색" size="xl" footerClassName="justify-content-center" width={970} draggable>
            <Form>
                <Form.Row>
                    {/* 키워드 */}
                    <Col xs={5} className="p-0 mb-2">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    keyword: e.target.value,
                                });
                            }}
                            onSearch={() => {
                                handleSearch(search);
                            }}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button
                            variant="gray150"
                            onClick={() => {
                                handleClickCancle();
                            }}
                        >
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={600}
                getRowHeight={40}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reporter) => reporter.id}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selected}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
            />
        </MokaModal>
    );
};

ReporterMgrSearchModal.propTypes = propTypes;
ReporterMgrSearchModal.defaultProps = defaultProps;

export default ReporterMgrSearchModal;
