import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { messageBox } from '@utils/toastUtil';
import { CodeAutocomplete } from '@pages/commons';
import { DB_DATEFORMAT } from '@/constants';
import { MokaModal, MokaInput, MokaTable } from '@/components';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { GET_ARTICLE_LIST_MODAL, initialState, getArticleListModal } from '@store/article';
import SourceSelector from '@pages/Article/components/Desking/SourceSelector';
import columnDefs from './ArticleListModalAgGridCoulmns';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 기사 클릭 시 동작
     */
    onRowClicked: PropTypes.func,
};
const defaultProps = {};
const initialSearch = { ...initialState.search, serviceFlag: 'Y' }; // 서비스플래그 Y인 것만 조회

/**
 * 기사 검색 모달
 */
const ArticleListModal = (props) => {
    const { show, onHide, onRowClicked } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_ARTICLE_LIST_MODAL]);
    const sourceList = useSelector(({ articleSource }) => articleSource.typeSourceList.JOONGANG);
    const [setGridInstance] = useState(null);
    const [period, setPeriod] = useState([0, 'days']);
    const [search, setSearch] = useState(initialSearch);
    const [valError, setValError] = useState({});
    const [list, setList] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * 모달 닫기
     */
    const handelHide = () => {
        setPeriod([0, 'days']);
        setSearch(initialSearch);
        setValError({});
        setRowData([]);
        setTotal(0);
        onHide();
    };

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;

            if (name === 'period') {
                // 기간 설정
                const { number, date } = e.target.selectedOptions[0].dataset;
                setPeriod([Number(number), date]);

                // startServiceDay, endServiceDay 변경
                const nd = new Date();
                const startServiceDay = moment(nd).subtract(Number(number), date).startOf('day');
                const endServiceDay = moment(nd);
                setSearch({ ...search, startServiceDay, endServiceDay });
            } else {
                setSearch({ ...search, [name]: value });
            }

            if (valError.sourceList) setValError({ ...valError, sourceList: false });
        },
        [search, valError],
    );

    /**
     * validate
     */
    const validate = useCallback(() => {
        let isInvalid = false;

        if (!search.sourceList || !REQUIRED_REGEX.test(search.sourceList)) {
            isInvalid = isInvalid || true;
            setValError({ ...valError, sourceList: true });
        }

        return !isInvalid;
    }, [search.sourceList, valError]);

    /**
     * row 클릭
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (row) => {
            if (onRowClicked) {
                onRowClicked(row);
            }
        },
        [onRowClicked],
    );

    /**
     * 리스트 조회
     * @param {object} searchObj 검색객체
     */
    const loadList = useCallback(
        ({ search: appendSearch }) => {
            const nt = new Date();
            const startServiceDay = !search.startServiceDay ? moment(nt).subtract(period[0], period[1]).startOf('day') : search.startServiceDay;
            const endServiceDay = !search.endServiceDay ? moment(nt).endOf('day') : search.endServiceDay;
            const ns = { ...search, ...appendSearch, startServiceDay, endServiceDay };
            const needCallSource = !ns.sourceList; // 매체 api 호출해야하는지
            setSearch(ns);

            dispatch(
                getArticleListModal({
                    getSourceList: needCallSource,
                    type: 'JOONGANG',
                    search: {
                        ...ns,
                        startServiceDay: moment(startServiceDay).format(DB_DATEFORMAT),
                        endServiceDay: moment(endServiceDay).format(DB_DATEFORMAT),
                    },
                    callback: ({ header, body, search }) => {
                        if (header.success) {
                            setList(body.list);
                            setTotal(body.totalCnt);
                            setSearch({ ...ns, sourceList: search.sourceList });
                        } else {
                            messageBox.alert('기사리스트 조회에 실패했습니다.');
                        }
                    },
                }),
            );
        },
        [dispatch, period, search],
    );

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        if (validate()) loadList({ search: ns });
    }, [loadList, validate]);

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = useCallback(
        (date) => {
            if (typeof date === 'object') {
                setSearch({ ...search, startServiceDay: date });
            } else if (date === '') {
                setSearch({ ...search, startServiceDay: null });
            }
        },
        [search],
    );

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = useCallback(
        (date) => {
            if (typeof date === 'object') {
                setSearch({ ...search, endServiceDay: date });
            } else if (date === '') {
                setSearch({ ...search, endServiceDay: null });
            }
        },
        [search],
    );

    /**
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = useCallback(
        (value) => {
            setSearch({ ...search, masterCode: value });
        },
        [search],
    );

    /**
     * 초기화 버튼
     * @param {object} e event
     */
    const handleClickReset = useCallback(() => {
        const nt = new Date();
        const startServiceDay = moment(nt).subtract(0, 'days').startOf('day');
        const endServiceDay = moment(nt);
        setPeriod([0, 'days']);
        setSearch({
            ...initialSearch,
            sourceList: (sourceList || []).map((s) => s.sourceCode).join(','),
            masterCode: null,
            startServiceDay: startServiceDay,
            endServiceDay: endServiceDay,
        });
    }, [sourceList]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { [key]: value };
            if (key !== 'page') temp['page'] = 0;
            loadList({ search: temp });
        },
        [loadList],
    );

    useEffect(() => {
        // 기사 처음 로드 + 매체도 조회 (매체가 변경되는 경우 이 effect를 탄다)
        if (show) loadList({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        if (show) {
            setRowData(
                rowData.map((row) => ({
                    ...row,
                    onClick: handleRowClicked,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, handleRowClicked]);

    useEffect(() => {
        setRowData(
            list.map((art) => ({
                ...art,
                unescapeTitle: unescapeHtmlArticle(art.artTitle),
                serviceDaytime: (art.serviceDaytime || '').slice(0, -3),
                onClick: handleRowClicked,
            })),
        );
    }, [handleRowClicked, list]);

    return (
        <MokaModal title="기사 검색" show={show} onHide={handelHide} size="lg" width={1000} height={800} bodyClassName="d-flex flex-column" draggable>
            <div>
                <Form.Row className="mb-2">
                    {/* 검색 기간 */}
                    <div className="mr-2 flex-shrink-0">
                        <MokaInput as="select" name="period" onChange={handleChangeValue} value={period.join('')}>
                            <option value="1days" data-number="1" data-date="days">
                                1일
                            </option>
                            <option value="3days" data-number="3" data-date="days">
                                3일
                            </option>
                            <option value="7days" data-number="7" data-date="days">
                                1주일
                            </option>
                            <option value="1months" data-number="1" data-date="months">
                                1개월
                            </option>
                            <option value="3months" data-number="3" data-date="months">
                                3개월
                            </option>
                        </MokaInput>
                    </div>

                    {/* 시작일, 종료일 */}
                    <div className="mr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, width: 140 }} onChange={handleChangeSDate} value={search.startServiceDay} />
                    </div>
                    <div className="mr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, width: 140 }} onChange={handleChangeEDate} value={search.endServiceDay} />
                    </div>

                    {/* 분류 전체 */}
                    <CodeAutocomplete name="masterCode" className="flex-fill mr-2" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} />

                    {/* 검색 버튼 */}
                    <Button variant="searching" className="flex-shrink-0" onClick={handleSearch}>
                        검색
                    </Button>
                </Form.Row>

                <Form.Row className="mb-14">
                    {/* 매체 */}
                    <SourceSelector
                        value={search.sourceList}
                        className="mr-2"
                        width={390}
                        onChange={(value) => handleChangeValue({ target: { name: 'sourceList', value } })}
                        isInvalid={valError.sourceList}
                        sourceList={sourceList}
                    />

                    {/* 검색 조건 */}
                    <div className="mr-2 flex-shrink-0">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((searchType) => (
                                <option key={searchType.id} value={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>

                    {/* 키워드 */}
                    <MokaInput className="flex-fill mr-2" name="keyword" value={search.keyword} placeholder="검색어를 입력하세요" onChange={handleChangeValue} />

                    {/* 초기화 */}
                    <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Form.Row>
            </div>

            <MokaTable
                className="article-list overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                headerHeight={50}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(article) => article.totalId}
                onRowClicked={() => {}}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['groupNumber', 'add']}
            />
        </MokaModal>
    );
};

ArticleListModal.propTypes = propTypes;
ArticleListModal.defaultProps = defaultProps;

export default ArticleListModal;
