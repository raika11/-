import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { clearSeoMeta, getSeoMeta, getSeoMetaList, initialState, saveSeoMeta, GET_SEO_META } from '@store/seoMeta';
import produce from 'immer';
import toast from '@utils/toastUtil';

/**
 * SEO 메타 정보
 */
const SEOMetaEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { totalId } = useParams();

    const [edit, setEdit] = useState(initialState.seoMeta);
    const { seoMeta, search, loading } = useSelector((store) => ({
        seoMeta: store.seoMeta.seoMeta,
        search: store.seoMeta.search,
        loading: store.loading[GET_SEO_META],
    }));

    const handleChangeValue = (name, value) => {
        setEdit(
            produce(edit, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleClickSave = () => {
        dispatch(
            saveSeoMeta({
                data: edit,
                callback: (response) => {
                    dispatch(getSeoMeta(totalId));
                    dispatch(getSeoMetaList(search));
                    toast.result(response);
                },
            }),
        );
    };

    const handleClickCancel = () => {
        dispatch(clearSeoMeta());
        history.push('/seo-meta');
    };

    useEffect(() => {
        setEdit(seoMeta);
    }, [seoMeta]);

    useEffect(() => {
        dispatch(getSeoMeta(totalId));
    }, [dispatch, totalId]);

    return (
        <MokaCard
            title="공유 메타데이터 관리"
            className="flex-fill"
            footerClassName="justify-content-center"
            footerButtons={[
                { text: edit.isInsert ? '저장' : '수정', variant: 'positive', onClick: handleClickSave, className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
            footer
            loading={loading}
        >
            <Form className="pb-2">
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용여부"
                            inputProps={{ checked: edit.usedYn === 'Y' }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                const value = checked ? 'Y' : 'N';
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="제목"
                            name="title"
                            value={edit.title}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="설명"
                            name="summary"
                            inputProps={{ rows: 8 }}
                            inputClassName="resize-none"
                            value={edit.summary}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="키워드" name="keyword" value={edit.keyword} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="추가 키워드"
                            name="addKeyword"
                            value={edit.addKeyword}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default SEOMetaEdit;
