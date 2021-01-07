import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { blockReason } from '@pages/CommentManage/CommentConst';
import moment from 'moment';
import { initialState, getCommentList, changeSearchOption } from '@store/commentManage';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';

/**
 * 컨테이너 검색 컴포넌트
 */
const BannedListSearch = () => {
    const [tempValue, setTempValue] = useState('');
    const [modalUsage, setModalUsage] = useState({
        usage: '',
    });

    const { pagePathName, pageGubun } = useSelector((store) => ({
        pagePathName: store.comment.banneds.pagePathName,
        pageGubun: store.comment.banneds.pageGubun,
    }));

    const [defaultInputModalState, setDefaultInputModalState] = useState(false);
    const tempEvent = (e) => {
        console.log('tempEvent', e);
    };

    useEffect(() => {
        setModalUsage({
            ...modalUsage,
            usage: pageGubun,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageGubun]);

    return (
        <Form className="mb-10">
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={null} onChange={(e) => tempEvent(e)} name="searchMedia">
                    <option hidden>차단목록</option>
                    {blockReason.map((media, index) => (
                        <option key={index} value={media.id}>
                            {media.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block">
                <MokaSearchInput value={tempValue} onChange={tempEvent} onSearch={tempEvent} name="keyword" />
            </div>
            <div className="d-inline-block float-right">
                <Button variant="positive" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    차단등록
                </Button>
                <Button variant="negative" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    적용하기
                </Button>
                <Button variant="negative" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    메모리
                </Button>
            </div>
            {defaultInputModalState && (
                <CommentBlockModal
                    ModalUsage={modalUsage}
                    show={defaultInputModalState}
                    onHide={() => {
                        setDefaultInputModalState(false);
                    }}
                />
            )}
        </Form>
    );
};

export default BannedListSearch;
