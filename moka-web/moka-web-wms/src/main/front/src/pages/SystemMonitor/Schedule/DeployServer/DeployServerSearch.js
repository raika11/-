import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { useHistory } from 'react-router-dom';

/**
 * 스케줄 서버 관리 > 배포 서버 검색
 */
const DeleteWorkSearch = () => {
    const history = useHistory();
    const [search, setSearch] = useState({
        alias: '',
        ip: '',
    });

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
     * 초기화 버튼
     */
    const handleClickReset = () => {
        setSearch({ ...search, alias: '', ip: '' });
    };

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        history.push(`/schedule/deploy-server/add`);
    };

    return (
        <Form className="mb-2">
            <div className="mb-2 d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <div className="mr-2" style={{ width: 200 }}>
                        <MokaInputLabel label="별칭" name="alias" value={search.alias} onChange={handleChangeValue} />
                    </div>
                    <div style={{ width: 200 }}>
                        <MokaInputLabel label="서버IP" name="ip" value={search.ip} onChange={handleChangeValue} />
                    </div>
                </div>
                <div className="d-flex">
                    <Button variant="searching" className="mr-2">
                        검색
                    </Button>
                    <Button variant="outline-neutral" onClick={handleClickReset}>
                        초기화
                    </Button>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </div>
        </Form>
    );
};

export default DeleteWorkSearch;
