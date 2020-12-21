import React from 'react';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput } from '@/components';

const ArticleSourceSearch = () => {
    return (
        <div className="mb-2 d-flex">
            <MokaSearchInput className="mr-2" name="keyword" onChange={(e) => e.target.value} />
            <Button>초기화</Button>
        </div>
    );
};

export default ArticleSourceSearch;
