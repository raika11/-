import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { initialState, getDistributeServerList, changeDeployServerSearchOption, clearDeployServerSearch } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 배포 서버 검색
 */
const DeleteWorkSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.schedule.deployServer.search);
    const [search, setSearch] = useState(initialState.deployServer.search);

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        dispatch(
            getDistributeServerList(
                changeDeployServerSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {
        dispatch(clearDeployServerSearch());
    };

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/deploy-server/add`);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getDistributeServerList());
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-14 justify-content-between">
                <Col xs={6} className="p-0 d-flex">
                    <div className="mr-2">
                        <MokaInputLabel label="별칭" name="serverNm" value={search.serverNm} onChange={handleChangeValue} />
                    </div>
                    <div>
                        <MokaInputLabel label="서버IP" name="serverIp" value={search.serverIp} onChange={handleChangeValue} />
                    </div>
                </Col>
                <div className="d-flex">
                    <Button variant="searching" className="mr-1" onClick={handleClickSearch}>
                        검색
                    </Button>
                    <Button variant="negative" onClick={handleClickReset}>
                        초기화
                    </Button>
                </div>
            </Form.Row>
            <div className="d-flex justify-content-end">
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </div>
        </Form>
    );
};

export default DeleteWorkSearch;
