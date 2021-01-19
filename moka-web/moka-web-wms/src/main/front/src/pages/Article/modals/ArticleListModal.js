import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { unescapeHtml } from '@utils/convertUtil';
import { CodeAutocomplete, SourceSelector } from '@pages/commons';
import { DB_DATEFORMAT } from '@/constants';
import { MokaModal, MokaInput, MokaSearchInput, MokaTable } from '@/components';
import GroupNumberRenderer from '@pages/Article/components/ArticleDeskList/GroupNumberRenderer';
import columnDefs from '@pages/Article/components/ArticleDeskList/ArticleDeskAgGridColums';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { GET_SERVICE_ARTICLE_LIST, initialState, getServiceArticleList, changeServiceSearchOption, clearServiceList } from '@store/article';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 기사 클릭 시 동작
     */
    onRowClicked: PropTypes.func,
};
const defaultProps = {};

/**
 * 기사 검색 모달
 */
const ArticleListModal = (props) => {
    const { show, onHide, media, onRowClicked } = props;
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.article.service.search);
    const list = useSelector((store) => store.article.service.list);
    const total = useSelector((store) => store.article.service.total);
    const error = useSelector((store) => store.article.service.error);
    const loading = useSelector((store) => store.loading[GET_SERVICE_ARTICLE_LIST]);
    const { PDS_URL, IR_URL } = useSelector((store) => ({
        PDS_URL: store.app.PDS_URL,
        IR_URL: store.app.IR_URL,
    }));
    const initialSearch = initialState.service.search;

    // state
    const [search, setSearch] = useState(initialSearch);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [valError, setValError] = useState({});
    const [sourceOn, setSourceOn] = useState(false);
    const [sourceList, setSourceList] = useState(null);
    const [rowData, setRowData] = useState([]);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
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
     * 검색
     */
    const handleSearch = () => {
        let ns = {
            ...search,
            sourceList,
            startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
            page: 0,
        };

        if (validate(ns)) {
            dispatch(changeServiceSearchOption(ns));
            dispatch(getServiceArticleList({ search: ns }));
        }
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
    const handleClickReset = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const date = new Date();

        dispatch(
            changeServiceSearchOption({
                ...initialSearch,
                masterCode: null,
                startServiceDay: moment(date).add(-24, 'hours').format(DB_DATEFORMAT),
                endServiceDay: moment(date).format(DB_DATEFORMAT),
                page: 0,
            }),
        );
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
        let temp = { ...storeSearch, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeServiceSearchOption(temp));
        dispatch(getServiceArticleList({ search: temp }));
    };

    useEffect(() => {
        if (media) setSearchDisabled(true);
    }, [media]);

    useEffect(() => {
        let ssd = moment(storeSearch.startServiceDay, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endServiceDay, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startServiceDay: ssd,
            endServiceDay: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재 시간(시분초o)
         * 종료일 : 현재 시간(시분초o)
         */
        if (show) {
            const date = new Date();
            const startServiceDay = moment(date).add(-24, 'hours').format(DB_DATEFORMAT);
            const endServiceDay = moment(date).format(DB_DATEFORMAT);
            let ns = {
                ...search,
                masterCode: null,
                sourceList,
                startServiceDay,
                endServiceDay,
                contentType: media ? 'M' : null,
                page: 0,
            };

            dispatch(changeServiceSearchOption(ns));
            if (sourceOn) {
                dispatch(getServiceArticleList({ search: ns }));
            }
        } else {
            dispatch(clearServiceList());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn, show]);

    useEffect(() => {
        setRowData(
            list.map((art) => {
                // 기자명 replace
                let reportersText = art.artReporter;
                const reporters = art.artReporter.split('.');
                if (reporters.length > 1) reportersText = `${reporters[0]} 외 ${reporters.length - 1}명`;

                // 제목 replace
                let escapeTitle = art.artTitle;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                // 면판 replace
                let myunPan = `${art.pressMyun || ''}/${art.pressPan || ''}`;

                // 출고시간/수정시간 replace
                let articleDt = moment(art.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm');
                if (art.artModDt) {
                    articleDt = `${articleDt}\n${moment(art.artModDt, DB_DATEFORMAT).format('MM-DD HH:mm')}`;
                } else {
                    articleDt = `${articleDt}\n `;
                }

                // 이미지경로
                let artPdsThumb = `${PDS_URL}${art.artThumb}`;
                // let artThumb = `${IR_URL}?t=k&w=100&h=100u=//${PDS_URL}${art.artThumb}`;
                let artThumb = artPdsThumb;

                return {
                    ...art,
                    escapeTitle,
                    myunPan,
                    articleDt,
                    reportersText,
                    gridType: 'ARTICLE',
                    artThumb,
                    artPdsThumb,
                };
            }),
        );
    }, [IR_URL, PDS_URL, list]);

    return (
        <MokaModal title="기사 검색" show={show} onHide={onHide} size="lg" width={1000} height={800} bodyClassName="d-flex flex-column" draggable>
            <Form>
                <Form.Row className="mb-2">
                    {/* 시작일, 종료일 */}
                    <Col xs={4} className="p-0 pr-2 d-flex">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} className="mr-1" onChange={handleChangeSDate} value={search.startServiceDay} />
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} className="ml-2" onChange={handleChangeEDate} value={search.endServiceDay} />
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
                    <Col xs={6} className="p-0">
                        <MokaSearchInput className="flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 분류 전체 */}
                    <Col xs={4} className="p-0 pr-2">
                        <CodeAutocomplete name="masterCode" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} />
                    </Col>
                    {/* 매체 전체 */}
                    <Col xs={3} className="p-0 pr-2">
                        <SourceSelector
                            value={sourceList}
                            onChange={(value) => {
                                setSourceList(value);
                                setValError({ ...valError, sourceList: false });
                                if (value !== '') {
                                    setSourceOn(true);
                                }
                            }}
                            width="100%"
                            sourceType={'DESKING'}
                            isInvalid={valError.sourceList}
                        />
                    </Col>
                    {/* 면 */}
                    <Col xs={1} className="p-0 pr-2">
                        <MokaInput placeholder="면" name="pressMyun" onChange={handleChangeValue} value={search.pressMyun} disabled={searchDisabled} />
                    </Col>
                    {/* 판 */}
                    <Col xs={1} className="p-0 pr-2">
                        <MokaInput placeholder="판" name="pressPan" onChange={handleChangeValue} value={search.pressPan} disabled={searchDisabled} />
                    </Col>
                    {/* 초기화 */}
                    <Col xs={3} className="p-0 d-flex justify-content-end">
                        <Button variant="negative" onClick={handleClickReset}>
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <MokaTable
                className="article-list overflow-hidden flex-fill"
                headerHeight={50}
                columnDefs={columnDefs.filter((c, i) => i !== 0 && i !== 1)}
                rowData={rowData}
                onRowNodeId={(article) => article.totalId}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                error={error}
                frameworkComponents={{ GroupNumberRenderer: GroupNumberRenderer }}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaModal>
    );
};

ArticleListModal.propTypes = propTypes;
ArticleListModal.defaultProps = defaultProps;

export default ArticleListModal;
