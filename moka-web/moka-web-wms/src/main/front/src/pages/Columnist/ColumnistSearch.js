import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { messageBox } from '@utils/toastUtil';
import { initialState, getColumnistList, changeSearchOption, clearColumnist } from '@store/columnist';
import { AuthButton } from '@pages/Auth/AuthButton';

/**
 * 칼럼니스트 > 검색
 */
const ColumnistSearch = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const storeSearch = useSelector(({ columnist }) => columnist.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 조건 초기화
     */
    const handleSearchReset = () => {
        setSearch(initialState.search);
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let temp = {
            ...search,
            page: 0,
        };

        if (temp.searchType === '') {
            delete temp.searchType;
        }

        dispatch(changeSearchOption(temp));
        dispatch(getColumnistList({ search: temp }));
    };

    /**
     * 등록
     */
    const handleNewColumnlist = () => {
        dispatch(clearColumnist());
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(
            getColumnistList({
                search: search,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="mb-14">
            {/* 상태정보 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="status" value={search.status} onChange={handleChangeValue}>
                    {initialState.statusSearchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInput>
            </Col>

            {/* 검색 타입 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                    <option value="">전체</option>
                    <option value="columnistNm">이름</option>
                    <option value="jplusRepDivNm">필진 타입</option>
                </MokaInput>
            </Col>

            {/* 이름 검색 */}
            <Col xs={8} className="p-0 d-flex">
                <MokaSearchInput
                    name="keyword"
                    placeholder="칼럼니스트 이름 검색"
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                    className="flex-fill mr-1"
                />

                {/* 초기화 버튼 */}
                <Button variant="negative" onClick={handleSearchReset} className="mr-1 flex-shrink-0">
                    초기화
                </Button>

                <AuthButton variant="positive" onClick={handleNewColumnlist} className="flex-shrink-0">
                    등록
                </AuthButton>
            </Col>
        </Form.Row>
    );
};

export default ColumnistSearch;
