import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, changeSetMenuSearchOption, clearSetMenuSearchOption, getSetMenuBoardsList } from '@store/board';

/**
 * 게시판 관리 > 전체 게시판 > 게시판 목록 검색
 */
const BoardsListSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 공통 구분값 URL
    const { pagePathName, boardType, storeSearch } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
        storeSearch: store.board.setMenu.search,
    }));
    const [searchData, setSearchData] = useState(initialState.setMenu.search);

    /**
     * input value
     */
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchData, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleClickSearchButton = () => {
        dispatch(getSetMenuBoardsList(changeSetMenuSearchOption(searchData)));
    };

    /**
     * 초기화 버튼
     */
    const handleClickSearchResetButton = () => {
        dispatch(clearSetMenuSearchOption()); // 스토어 검색 옵션 초기화
        const tmpSearchOption = {
            ...initialState.setMenu.search,
            boardType: boardType, // store 공통 구분값에서 보드 타입을 가지고 온다. (S: 서비스, A: 관리자)
        };
        setSearchData(tmpSearchOption);
    };

    /**
     * 등록 버튼
     */
    const handleBoardNewButton = () => {
        history.push(`/${pagePathName}/add`);
    };

    useEffect(() => {
        // 공통 구분값 boardType이 업데이트되면 검색 옵션, store 겁색 옵션 설정
        if (boardType) {
            setSearchData({
                ...storeSearch,
                boardType: boardType,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardType]);

    useEffect(() => {
        setSearchData(storeSearch);
    }, [storeSearch]);

    return (
        <Form.Row className="mb-14">
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="usedYn" value={searchData.usedYn} onChange={handleSearchChange}>
                    <option value="">전체</option>
                    <option value="Y">사용</option>
                    <option value="N">중지</option>
                </MokaInput>
            </Col>
            <MokaSearchInput
                id="keyword"
                name="keyword"
                className="flex-fill mr-1"
                placeholder={'게시판명, 설명'}
                value={searchData.keyword}
                onChange={handleSearchChange}
                onSearch={handleClickSearchButton}
            />
            <Button variant="negative" className="mr-1" onClick={handleClickSearchResetButton}>
                초기화
            </Button>
            <Button variant="positive" onClick={handleBoardNewButton}>
                등록
            </Button>
        </Form.Row>
    );
};

export default BoardsListSearch;
