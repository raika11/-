import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';

const RunStateSearch = () => {
    const [search, setSearch] = useState({
        group: 'all',
        cycle: 'all',
        type: 'all',
        server: 'all',
        state: 'all',
        searchType: 'all',
        keyword: '',
    });

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    return (
        <Form className="mb-2">
            <div className="mb-2 d-flex align-items-center justify-content-between">
                {/* 기타코드에서 가져옴 'GEN_CATE' */}
                <MokaInputLabel label="분류" as="select" name="group" className="mr-2" value={search.group} onChange={handleChangeValue}>
                    <option vlaue="all">전체</option>
                </MokaInputLabel>
                <MokaInputLabel label="주기" as="select" name="cycle" className="mr-2" value={search.cycle} onChange={handleChangeValue}>
                    <option vlaue="all">전체</option>
                    <option vlaue="30s">30초</option>
                    <option vlaue="1m">1분</option>
                    <option vlaue="2m">2분</option>
                    <option vlaue="5m">5분</option>
                    <option vlaue="10m">10분</option>
                    <option vlaue="20m">20분</option>
                    <option vlaue="30m">30분</option>
                    <option vlaue="1h">1시간</option>
                    <option vlaue="12h">12시간</option>
                    <option vlaue="24h">24시간</option>
                </MokaInputLabel>
                <MokaInputLabel label="타입" as="select" name="type" className="mr-2" value={search.type} onChange={handleChangeValue}>
                    <option vlaue="all">전체</option>
                    <option vlaue="ftp">FTP</option>
                    <option vlaue="copyNetwork">네트워크 복사</option>
                </MokaInputLabel>
                <MokaInputLabel label="배포 서버" as="select" name="server" className="mr-2" value={search.server} onChange={handleChangeValue}>
                    <option vlaue="all">전체</option>
                </MokaInputLabel>
                <MokaInputLabel label="상태" as="select" name="state" value={search.state} onChange={handleChangeValue}>
                    <option vlaue="all">전체</option>
                    <option vlaue="success">성공</option>
                    <option vlaue="fail">실패</option>
                </MokaInputLabel>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <div className="mr-2" style={{ width: 100 }}>
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            <option vlaue="all">전체</option>
                            <option vlaue="url">URL</option>
                            <option vlaue="route">배포 경로</option>
                            <option vlaue="desc">설명</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 350 }}>
                        <MokaInput name="keyword" value={search.keyword} onChange={handleChangeValue} />
                    </div>
                </div>
                <div className="d-flex">
                    <Button variant="searching" className="mr-2">
                        검색
                    </Button>
                    <Button variant="outline-neutral">초기화</Button>
                </div>
            </div>
        </Form>
    );
};

export default RunStateSearch;
