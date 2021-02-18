import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { messageBox } from '@utils/toastUtil';
import { CodeAutocomplete } from '@pages/commons';
import SourceSelector from '@pages/commons/SourceSelector';
import { DB_DATEFORMAT } from '@/constants';
import { MokaModal, MokaInput, MokaTable } from '@/components';
import columnDefs from './ArticleListModalAgGridCoulmns';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { GET_ARTICLE_LIST_MODAL, initialState, getArticleListModal } from '@store/article';

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
    const [period, setPeriod] = useState([0, 'days']);
    const [search, setSearch] = useState(initialSearch);
    const [valError, setValError] = useState({});
    const [sourceOn, setSourceOn] = useState(false); // 매체검색조건이 셋팅됐는지 체크
    const [sourceList, setSourceList] = useState(null); // 매체리스트 (String)
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * 모달 닫기
     */
    const handelHide = () => {
        setPeriod([0, 'days']);
        setSearch(initialSearch);
        setValError({});
        setSourceOn(false);
        setSourceList(null);
        setRowData([]);
        setTotal(0);
        onHide();
    };

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
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
    };

    /**
     * validate
     */
    const validate = (ns) => {
        let isInvalid = false;

        if (!REQUIRED_REGEX.test(ns.sourceList)) {
            isInvalid = isInvalid || true;
            setValError({ ...valError, sourceList: true });
        }

        return !isInvalid;
    };

    /**
     * 리스트 조회
     * @param {object} searchObj 검색객체
     */
    const loadList = (searchObj) => {
        dispatch(
            getArticleListModal({
                search: {
                    ...searchObj,
                    startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
                    endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        setTotal(body.totalCnt);
                        setRowData(
                            body.list.map((art) => ({
                                ...art,
                                unescapeTitle: unescapeHtmlArticle(art.artTitle),
                                serviceDaytime: (art.serviceDaytime || '').slice(0, -3),
                                onClick: handleRowClicked,
                            })),
                        );
                    } else {
                        messageBox.alert('기사리스트 조회에 실패했습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = { ...search, page: 0 };
        if (validate(ns)) loadList(ns);
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startServiceDay: date });
        } else if (date === '') {
            setSearch({ ...search, startServiceDay: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endServiceDay: date });
        } else if (date === '') {
            setSearch({ ...search, endServiceDay: null });
        }
    };

    /**
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = (value) => {
        setSearch({ ...search, masterCode: value });
    };

    /**
     * 초기화 버튼
     * @param {object} e event
     */
    const handleClickReset = () => {
        const nt = new Date();
        const startServiceDay = moment(nt).subtract(0, 'days').startOf('day');
        const endServiceDay = moment(nt);
        setPeriod([0, 'days']);
        setSearch({
            ...initialSearch,
            masterCode: null,
            startServiceDay: startServiceDay,
            endServiceDay: endServiceDay,
        });
    };

    /**
     * row 클릭
     * @param {object} data data
     */
    const handleRowClicked = (row) => {
        if (onRowClicked) {
            onRowClicked(row);
        }
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
        loadList(temp);
    };

    useEffect(() => {
        /**
         * 시작일 : 현재일(자정) - period
         * 종료일 : 현재 시간(시분초o)
         */
        if (show) {
            const nt = new Date();
            const startServiceDay = moment(nt).subtract(period[0], period[1]).startOf('day').format(DB_DATEFORMAT);
            const endServiceDay = moment(nt).format(DB_DATEFORMAT);
            const ns = { ...search, sourceList, startServiceDay, endServiceDay, page: 0 };
            setSearch(ns);
            if (sourceOn) {
                loadList(ns);
            }
        } else {
            setRowData([]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn, show]);

    return (
        <MokaModal title="기사 검색" show={show} onHide={handelHide} size="lg" width={1000} height={800} bodyClassName="d-flex flex-column" draggable>
            <Form>
                <Form.Row className="mb-2">
                    {/* 검색 기간, 시작일, 종료일 */}
                    <Col xs={5} className="p-0 pr-2 d-flex">
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
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} className="mr-1" onChange={handleChangeSDate} value={search.startServiceDay} />
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} className="ml-1" onChange={handleChangeEDate} value={search.endServiceDay} />
                    </Col>

                    {/* 분류 전체 */}
                    <Col xs={6} className="p-0 pr-2">
                        <CodeAutocomplete name="masterCode" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} />
                    </Col>

                    {/* 검색 버튼 */}
                    <Col xs={1} className="p-0">
                        <Button variant="searching" className="w-100 h-100" onClick={handleSearch}>
                            검색
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 매체 */}
                    <Col xs={3} className="p-0 pr-2">
                        <SourceSelector
                            value={sourceList}
                            className="h-100 w-100"
                            onChange={(value) => {
                                setSourceList(value);
                                setValError({ ...valError, sourceList: false });
                                if (value !== '') {
                                    setSourceOn(true);
                                }
                            }}
                            isInvalid={valError.sourceList}
                            sourceType="JOONGANG"
                        />
                    </Col>

                    {/* 검색 조건 */}
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((searchType) => (
                                <option key={searchType.id} value={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>

                    {/* 키워드 */}
                    <Col xs={6} className="p-0 pr-2">
                        <MokaInput className="flex-fill" name="keyword" value={search.keyword} placeholder="검색어를 입력하세요" onChange={handleChangeValue} />
                    </Col>

                    {/* 초기화 */}
                    <Col xs={1} className="p-0">
                        <Button variant="negative" className="w-100 h-100" onClick={handleClickReset}>
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <MokaTable
                className="article-list overflow-hidden flex-fill"
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
