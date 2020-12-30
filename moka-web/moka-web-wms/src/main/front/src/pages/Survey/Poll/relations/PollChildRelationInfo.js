import React, { useCallback, useState } from 'react';
import { MokaCard } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import RelationPollInfoComponent from '@pages/Survey/Poll/components/RelationPollInfoComponent';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';
import toast from '@utils/toastUtil';
import RelationArticleInfoComponent from '@pages/Survey/Poll/components/RelationArticleInfoComponent';
import commonUtil from '@utils/commonUtil';
import { useHistory } from 'react-router-dom';

const PollChildRelation = () => {
    const history = useHistory();
    const [isRelationPollModalShow, setIsRelationPollModalShow] = useState(false);

    const [relationPolls, setRelationPolls] = useState([]);

    const [relationArticles, setRelationArticles] = useState([]);

    const handleClickRelationPollAdd = (data) => {
        if (relationPolls.filter((poll) => poll.id === data.id).length > 0) {
            toast.warning(`중복된 투표정보(id=${data.id})가 존재합니다.`);
        } else {
            setRelationPolls([...relationPolls, { id: data.id, title: data.title }]);
        }
    };

    const handleClickRelationPollDelete = (id) => {
        setRelationPolls(relationPolls.filter((polls) => polls.id !== id));
    };

    const handleClickSearch = () => {
        setIsRelationPollModalShow(true);
    };
    const handleClickClose = () => {
        setIsRelationPollModalShow(false);
    };

    const handleClickRelationArticleAdd = (data) => {
        if (commonUtil.isEmpty(data)) {
            setRelationArticles([...relationArticles, { url: '', title: '' }]);
        }
    };

    const handleClickRelationArticleDelete = (id) => {
        setRelationArticles(relationArticles.filter((data, index) => index !== id));
    };

    return (
        <div className="d-flex">
            <MokaCard
                title="관련 정보"
                headerClassName="pb-0"
                bodyClassName="pt-0"
                className="flex-fill"
                footer
                footerClassName="justify-content-center"
                footerButtons={[
                    { text: '저장', variant: 'positive', onClick: () => console.log('저장'), className: 'mr-05' },
                    { text: '취소', variant: 'negative', onClick: () => history.push('/poll'), className: 'mr-05' },
                ]}
            >
                <Form>
                    <hr />
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="pr-2">관련 투표</Form.Label>
                                    <Button variant="searching" size="sm" onClick={handleClickSearch}>
                                        검색
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        {relationPolls.length > 0 &&
                            relationPolls.map((relationPoll, index) => (
                                <RelationPollInfoComponent key={index} id={relationPoll.id} title={relationPoll.title} onDelete={handleClickRelationPollDelete} />
                            ))}
                    </Form.Group>
                    <hr />
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="pr-2">관련 정보</Form.Label>
                                    <Button variant="positive" size="sm" onClick={() => handleClickRelationArticleAdd()}>
                                        추가
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        {relationArticles.length > 0 &&
                            relationArticles.map((relationArticle, index) => (
                                <RelationArticleInfoComponent
                                    key={index}
                                    id={index}
                                    title={relationArticle.title}
                                    url={relationArticle.url}
                                    onDelete={handleClickRelationArticleDelete}
                                />
                            ))}
                    </Form.Group>
                </Form>
            </MokaCard>
            <RelationPollModal show={isRelationPollModalShow} onHide={handleClickClose} onAdd={handleClickRelationPollAdd}></RelationPollModal>
        </div>
    );
};

export default PollChildRelation;
