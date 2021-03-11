import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, changeListmenuSearchOption, clearSetMenuSearchOption, clearListmenuContentsInfo, getListmenuContentsList } from '@store/board';
import toast from '@utils/toastUtil';
import produce from 'immer';

const initGubunSearchItem = {
    nm1: {
        ck: false,
        list: [],
    },
    nm2: {
        ck: false,
        list: [],
    },
};

const SearchBox = (props) => {
    const searchInitData = initialState.listmenu.contentsList.search;
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const boardId = useRef(null);

    // 공통 구분값 URL
    const { pagePathName, selectboard } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        selectboard: store.board.listmenu.selectboard,
    }));

    const [gubunSearchItem, setGubunSearchItem] = useState(initGubunSearchItem);
    const [searchData, setSearchData] = useState(searchInitData);

    // sotre 기본 검색 옵션 리턴.
    const getInitSearchOption = () => {
        return {
            ...initialState.listmenu.contentsList.search,
        };
    };

    // 각 검색 옵션 reset 처리.
    const searchDataReset = () => {
        dispatch(clearSetMenuSearchOption());
        setSearchData(getInitSearchOption());
        dispatch(changeListmenuSearchOption(getInitSearchOption()));
    };

    // 검색 데이값 변경 처리.
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 날짜 변경 처리 후 검색 옵션 스테이트 업데이트.
    const handleDateChange = (name, date) => {
        if (name === 'startDt') {
            const startDt = new Date(date);
            const endDt = new Date(searchData.endDt);

            if (startDt > endDt) {
                toast.warning('시작일은 종료일 보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'endDt') {
            const startDt = new Date(searchData.startDt);
            const endDt = new Date(date);

            if (endDt < startDt) {
                toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
                return;
            }
        }

        setSearchData({
            ...searchData,
            [name]: date,
        });
    };

    // 검색 버튼 클릭 처리.
    const handleClickSearchButton = () => {
        dispatch(
            changeListmenuSearchOption({
                ...searchData,
                startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
            }),
        );
        dispatch(getListmenuContentsList({ boardId: boardId.current }));
    };

    // 검색 초기화 버튼 클릭 처리.
    const handleClickResetButton = () => {
        searchDataReset();
        dispatch(getListmenuContentsList({ boardId: boardId.current }));
    };

    // 등록 버튼 클릭시 라우터 이동.
    const handleClickNewButton = () => {
        dispatch(clearListmenuContentsInfo());
        history.push(`/${pagePathName}/${boardId.current}/add`);
    };

    // useRef 현재 선택된 게시판, 게시글 정보 설정.
    useEffect(() => {
        if (!isNaN(params.boardId) && boardId.current !== params.boardId) {
            boardId.current = params.boardId;
        }
    }, [params]);

    useEffect(() => {
        const setPageSearchItem = ({ titlePrefixNm1, titlePrefix1, titlePrefixNm2, titlePrefix2 }) => {
            let tempItem = initGubunSearchItem;
            if (titlePrefixNm1) {
                tempItem = produce(tempItem, (draft) => {
                    draft.nm1.ck = true;
                    draft.nm1.name = titlePrefixNm1;
                    draft.nm1.list = titlePrefix1
                        .split(',')
                        .map((e) => e.replace(' ', ''))
                        .filter((e) => e !== '');
                });
            }

            if (titlePrefixNm2) {
                tempItem = produce(tempItem, (draft) => {
                    draft.nm2.ck = true;
                    draft.nm2.name = titlePrefixNm2;
                    draft.nm2.list = titlePrefix2
                        .split(',')
                        .map((e) => e.replace(' ', ''))
                        .filter((e) => e !== '');
                });
            }

            setGubunSearchItem(tempItem);
        };

        if (selectboard.boardId) {
            setPageSearchItem(selectboard);
        }
    }, [selectboard]);

    useEffect(() => {
        const setStartPage = () => {
            searchDataReset();
        };

        // 최초 한번만 설정. ( 페이지 로딩직후 옵션을 store 값으로 init)
        setStartPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-14">
            {/* 날짜 */}
            <Form.Row className="d-flex mb-2 mr-0">
                {/* 시작 날짜 */}
                <Col xs={5} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-1"
                        name="startDt"
                        id="startDt"
                        value={searchData.startDt}
                        onChange={(param) => {
                            // const selectDate = param._d;
                            // const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            handleDateChange('startDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
                    />

                    {/* 종료 날짜 */}

                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        name="endDt"
                        id="endDt"
                        value={searchData.endDt}
                        onChange={(param) => {
                            // const selectDate = param._d;
                            // const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            handleDateChange('endDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>

                {/* 게시판 사용 비상용 선택. */}
                <MokaInput className="mr-2" as="select" name="usedYn" id="usedYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                    {selectItem.usedYn.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.name}
                        </option>
                    ))}
                </MokaInput>

                {gubunSearchItem && gubunSearchItem.nm1.ck === true && (
                    <MokaInput className="mr-2" as="select" name="titlePrefix1" id="titlePrefix1" value={searchData.titlePrefix1} onChange={(e) => handleSearchChange(e)}>
                        <option value="">{gubunSearchItem.nm1.name}</option>
                        {gubunSearchItem.nm1.list.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </MokaInput>
                )}

                {gubunSearchItem && gubunSearchItem.nm2.ck === true && (
                    <MokaInput className="mr-2" as="select" name="titlePrefix2" id="titlePrefix2" value={searchData.titlePrefix2} onChange={(e) => handleSearchChange(e)}>
                        <option value="">{gubunSearchItem.nm2.name}</option>
                        {gubunSearchItem.nm2.list.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </MokaInput>
                )}

                {/* 검색 옵션 리셋. */}
                <Col xs={1} className="p-0 pr-2">
                    <Button className="flex-shrink-0" variant="negative" onClick={() => handleClickResetButton()}>
                        초기화
                    </Button>
                </Col>
                {/* </Col> */}
            </Form.Row>

            <Form.Row>
                {/* 채널 선택. */}
                <MokaSearchInput
                    id="keyword"
                    name="keyword"
                    className="mr-2 flex-fill"
                    placeholder={'제목, 내용, 등록자 명'}
                    value={searchData.keyword}
                    onChange={(e) => handleSearchChange(e)}
                    onSearch={() => handleClickSearchButton()}
                />

                {/* 게시글 등록 버튼 */}
                <Button className="flex-shrink-0" variant="positive" onClick={() => handleClickNewButton()}>
                    등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default SearchBox;
