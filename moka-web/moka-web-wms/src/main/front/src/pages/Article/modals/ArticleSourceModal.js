import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeSourceList, GET_TYPE_SOURCE_LIST } from '@store/articleSource';
import { MokaModal, MokaInput } from '@components';

const propTypes = {
    /**
     * 매체의 타입
     */
    sourceType: PropTypes.oneOf(['DESKING', 'JOONGANG', 'CONSALES', 'JSTORE', 'SOCIAL', 'BULK', 'RCV']),
};
const defaultProps = {
    sourceType: 'JOONGANG',
};

const ArticleSourceModal = (props) => {
    const { show, onHide, value, onChange, sourceType } = props;
    const dispatch = useDispatch();
    const typeSourceList = useSelector((store) => store.articleSource.typeSourceList); // 타입별 매체
    const loading = useSelector((store) => store.loading[GET_TYPE_SOURCE_LIST]);
    const [renderList, setRenderList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터의 index를 찾음
     * @param {string} 매체ID
     */
    const findSourceIndex = useCallback((id) => renderList.findIndex((sc) => sc.sourceCode === id), [renderList]);

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터 찾음
     * @param {string} 매체ID
     */
    const findSource = useCallback((id) => renderList.find((sc) => sc.sourceCode === id), [renderList]);

    /**
     * 체크박스 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        const nt = findSource(id);
        let resultList = [];

        if (checked) {
            resultList = produce(selectedList, (draft) => {
                draft.push(nt);
            });
        } else {
            const idx = selectedList.findIndex((s) => s.sourceCode === id);
            resultList = produce(selectedList, (draft) => {
                draft.splice(idx, 1);
            });
        }

        setSelectedList(resultList);
    };

    /**
     * 전체 선택
     * @param {object} e event
     */
    const handleAllCheck = (e) => {
        const { checked } = e.target;
        if (checked) {
            setSelectedList(renderList);
        } else {
            setSelectedList([]);
        }
    };

    /**
     * 확인 버튼
     */
    const handleClickSave = () => {
        onChange(selectedList.map((r) => r.sourceCode).join(','));
        handleClickCancle();
    };

    /**
     * 취소 버튼
     */
    const handleClickCancle = () => {
        setSelectedList([]);
        onHide();
    };

    useEffect(() => {
        // 타입별 매체 조회
        if (!typeSourceList?.[sourceType]) {
            dispatch(getTypeSourceList({ type: sourceType }));
        } else {
            setRenderList(typeSourceList[sourceType] || []);
        }
    }, [dispatch, sourceType, typeSourceList]);

    useEffect(() => {
        if (show) {
            if (renderList.length < 1) return;
            if (value || value === '') {
                // 1,3,60,61 => [1, 3, 60, 61]로 파싱하고, renderList에 포함되어 있는 데이터만 남기도록 필터링한다
                const valueArr = value
                    .split(',')
                    .filter((v) => v !== '')
                    .filter((v) => findSourceIndex(v) > -1);

                setSelectedList(valueArr.map((v) => findSource(v)));
            }
        }
    }, [renderList, value, findSourceIndex, findSource, show]);

    useEffect(() => {
        if (!value && renderList.length > 0) {
            onChange(renderList.map((r) => r.sourceCode).join(','));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderList]);

    return (
        <MokaModal
            show={show}
            onHide={handleClickCancle}
            width={600}
            height={600}
            size="md"
            buttons={[
                { text: '확인', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            bodyClassName="overflow-hidden"
            loading={loading}
            centered
        >
            <div className="d-flex flex-column h-100">
                <div className="d-flex pl-2">
                    <MokaInput
                        as="checkbox"
                        id="all-check"
                        inputProps={{ label: '전체 선택', custom: true, checked: !loading && renderList.length === selectedList.length }}
                        onChange={handleAllCheck}
                    />
                </div>
                <hr className="divider my-2" />
                <div className="flex-fill overflow-hidden pt-2">
                    <Form.Row className="flex-wrap input-border custom-scroll h-100">
                        {renderList.map((source, idx) => {
                            let isLastRow = false;

                            if (renderList.length % 2 === 0) {
                                isLastRow = (idx % 2 === 0 && idx === renderList.length - 1) || (idx % 2 === 1 && idx === renderList.length - 2);
                            } else if (renderList.length % 2 === 1) {
                                isLastRow = idx === renderList.length - 1;
                            }

                            return (
                                <Col xs={6} key={idx} className={clsx('p-2', { 'border-right': idx % 2 === 0, 'border-bottom': !isLastRow })}>
                                    <MokaInput
                                        as="checkbox"
                                        name="source"
                                        id={source.sourceCode}
                                        onChange={handleChangeValue}
                                        inputProps={{ label: source.sourceName, custom: true, checked: selectedList.findIndex((s) => s.sourceCode === source.sourceCode) > -1 }}
                                    />
                                </Col>
                            );
                        })}
                    </Form.Row>
                </div>
            </div>
        </MokaModal>
    );
};

ArticleSourceModal.propTypes = propTypes;
ArticleSourceModal.defaultProps = defaultProps;

export default ArticleSourceModal;
