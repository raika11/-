import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './PageChildContainerSearch';
import AgGrid from './PageChildContainerAgGrid';

const PageChildContainerList = (props) => {
    return (
        <Card>
            {/* 카드 헤더 */}
            <Card.Header>
                <Card.Title className="h-100">컨테이너 검색</Card.Title>
            </Card.Header>

            {/* 카드 바디 */}
            <Card.Body>
                {/* 검색 및 버튼 */}
                <Search />
                {/* 목록 및 페이징 */}
                <AgGrid />
            </Card.Body>
        </Card>
    );
};

export default PageChildContainerList;
