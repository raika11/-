import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 검색
 */
const DeleteWorkSearch = () => {
    const [search, setSearch] = useState({
        group: 'all',
        cycle: 'all',
        type: 'all',
        server: 'all',
        searchType: 'all',
        keyword: '',
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
        setSearch({ ...search, group: 'all', cycle: 'all', type: 'all', server: 'all', searchType: 'all', keyword: '' });
    };

    return (
        <Form className="mb-14">
            <div className="mb-2 d-flex align-items-center">
                {/* 기타코드에서 가져옴 'GEN_CATE' */}
                <MokaInput as="select" name="group" className="mr-2" value={search.group} onChange={handleChangeValue}>
                    <option value="all">분류 전체</option>
                </MokaInput>
                <MokaInput as="select" name="cycle" className="mr-2" value={search.cycle} onChange={handleChangeValue}>
                    <option value="all">주기 전체</option>
                    <option value="30s">30초</option>
                    <option value="1m">1분</option>
                    <option value="2m">2분</option>
                    <option value="5m">5분</option>
                    <option value="10m">10분</option>
                    <option value="20m">20분</option>
                    <option value="30m">30분</option>
                    <option value="1h">1시간</option>
                    <option value="12h">12시간</option>
                    <option value="24h">24시간</option>
                </MokaInput>
                <MokaInput as="select" name="type" className="mr-2" value={search.type} onChange={handleChangeValue}>
                    <option value="all">타입 전체</option>
                    <option value="ftp">FTP</option>
                    <option value="copyNetwork">네트워크 복사</option>
                </MokaInput>
                <MokaInput as="select" name="server" value={search.server} onChange={handleChangeValue}>
                    <option value="all">배포 서버 전체</option>
                </MokaInput>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <div style={{ width: 100 }} className="mr-2">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                            <option value="url">URL</option>
                            <option value="route">배포 경로</option>
                            <option value="desc">설명</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 350 }}>
                        <MokaInput name="keyword" value={search.keyword} onChange={handleChangeValue} />
                    </div>
                </div>
                <div className="d-flex">
                    <Button variant="searching" className="mr-1">
                        검색
                    </Button>
                    <Button variant="outline-neutral" onClick={handleClickReset}>
                        초기화
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default DeleteWorkSearch;
