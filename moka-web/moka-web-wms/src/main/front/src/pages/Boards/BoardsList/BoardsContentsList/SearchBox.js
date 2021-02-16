import React, { useEffect, useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, changeListmenuSearchOption, clearSetMenuSearchOption, clearListmenuContentsInfo, getListmenuContentsList } from '@store/board';
import toast from '@utils/toastUtil';

const SearchBox = (props) => {
    const searchInitData = initialState.listmenu.contentsList.search;
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const boardId = useRef(null);

    // 공통 구분값 URL
    const { pagePathName, channeltype_list } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        channeltype_list: store.board.channeltype_list,
    }));

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
        const setStartPage = () => {
            searchDataReset();
        };

        // 최초 한번만 설정. ( 페이지 로딩직후 옵션을 store 값으로 init)
        setStartPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-2">
            {/* 날짜 */}
            <Form.Row className="d-flex mb-2">
                {/* 시작 날짜 */}
                <div style={{ width: 130 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="dateTimePicker"
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
                </div>

                {/* 종료 날짜 */}
                <div style={{ width: 130 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="dateTimePicker"
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
                </div>

                {/* 게시판 사용 비상용 선택. */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="usedYn" id="usedYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                        <option hidden>선택</option>
                        {selectItem.usedYn.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 말머리1 검색. */}
                <MokaInput
                    className="mr-2 flex-fill"
                    id="titlePrefix1"
                    name="titlePrefix1"
                    placeholder="말머리1"
                    value={searchData.titlePrefix1}
                    onChange={(e) => handleSearchChange(e)}
                />

                {/* 검색 옵션 리셋. */}
                <Button className="flex-shrink-0" variant="negative" onClick={() => handleClickResetButton()}>
                    초기화
                </Button>
            </Form.Row>

            <Form.Row>
                {/* 채널 선택. */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="searchType" id="searchType" value={searchData.searchType} onChange={(e) => handleSearchChange(e)}>
                        <option hidden>선택</option>
                        {channeltype_list.map((item, index) => (
                            <option key={index} value={item.dtlCd}>
                                {item.cdNm}
                            </option>
                        ))}
                    </MokaInput>
                </div>

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
