import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { clearSeoMeta, getSeoMeta, getSeoMetaList, initialState, saveSeoMeta, GET_SEO_META } from '@store/seoMeta';
import produce from 'immer';
import toast from '@utils/toastUtil';

const labelWidth = 50;
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
                { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'mr-2' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel, className: 'mr-2' },
            ]}
            footer
            loading={loading}
        >
            <Form className="pb-2">
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용유무"
                            labelWidth={labelWidth}
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
                    <Col xs={12}>
                        <MokaInputLabel
                            label="제목"
                            name="title"
                            labelWidth={labelWidth}
                            value={edit.title}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            label="설명"
                            name="summary"
                            labelWidth={labelWidth}
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
                    <Col xs={12}>
                        <MokaInputLabel label="키워드" name="keyword" labelWidth={labelWidth} value={edit.keyword} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            label="추가\n키워드"
                            name="addKeyword"
                            labelWidth={labelWidth}
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
