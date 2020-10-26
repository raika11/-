import React from 'react';
import Button from 'react-bootstrap/Button';

const CodeMgtList = () => {
    /**
     * 그룹 추가 버튼 클릭
     */
    const handleClickAdd = {};

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={handleClickAdd}>
                    그룹 추가
                </Button>
            </div>
            <div>AgGrid</div>
        </>
    );
};

export default CodeMgtList;
