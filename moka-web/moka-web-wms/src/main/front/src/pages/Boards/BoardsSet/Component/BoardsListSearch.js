import React, { useEffect, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, changeSetMenuSearchOption, clearSetMenuSearchOption, getSetmenuBoardsList, clearSetmenuBoardInfo } from '@store/board';
import { selectItem } from '@pages/Boards/BoardConst';

// 검색 박스
const BoardsListSearchBox = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 공통 구분값 URL
    const { pagePathName, boardType } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
        search: store.board.setmenu.search,
    }));

    const [searchData, setSearchData] = useState(initialState.setmenu.search);

    // 등록 버튼
    const handleBoardNewButton = () => {
        dispatch(clearSetmenuBoardInfo());
        history.push(`/${pagePathName}/add`);
    };

    // 검색 데이값 처리.
    const handleSearchChange = ({ target: { name, value } }) => {
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 검색 버튼 클릭 처리.
    const handleClickSearchButton = () => {
        dispatch(getSetmenuBoardsList(changeSetMenuSearchOption(searchData)));
    };

    // 리셋 버튼 클릭 처리.
    const handleClickSearchResetButton = () => {
        dispatch(clearSetMenuSearchOption()); // 스토어에 검색 옵션을 초기화
        const tmpSearchOption = {
            ...initialState.setmenu.search,
            boardType: boardType, // store 공통 구분값에서 보드 타입을 가지고 온다. (S: 서비스, A: 관리자)
        };
        setSearchData(tmpSearchOption); // state 변경.
        dispatch(getSetmenuBoardsList(changeSetMenuSearchOption(tmpSearchOption))); // store 에 검색 옵션 변경후 리스트를 가지고 온다.
    };

    useEffect(() => {
        // 공통 구분값 boardType 이 업데이트되면 검색 옵션, store 겁색 옵션 설정.
        if (boardType) {
            setSearchData({
                ...initialState.setmenu.search,
                boardType: boardType,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardType]);

    return (
        <Form.Row className="mb-14">
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                    <option value="">전체</option>
                    {selectItem.usedYn.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.name}
                        </option>
                    ))}
                </MokaInput>
            </Col>
            <Col xs={8} className="p-0 pr-2">
                <MokaSearchInput
                    id="keyword"
                    name="keyword"
                    className="mb-0"
                    placeholder={'게시판명, 설명'}
                    value={searchData.keyword}
                    onChange={(e) => handleSearchChange(e)}
                    onSearch={() => handleClickSearchButton()}
                />
            </Col>
            <Col xs={1} className="p-0 align-items-center">
                <Button variant="negative" onClick={() => handleClickSearchResetButton()}>
                    초기화
                </Button>
            </Col>
            <Col xs={1} className="p-0 align-items-center text-right">
                <Button variant="positive" onClick={() => handleBoardNewButton()}>
                    등록
                </Button>
            </Col>
        </Form.Row>
    );
};

export default BoardsListSearchBox;
