import React, { useEffect, useState } from 'react';
import { MokaCard } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import RelationPollInfoComponent from '@pages/Survey/Poll/components/RelationPollInfoComponent';
import toast from '@utils/toastUtil';
import RelationArticleInfoComponent from '@pages/Survey/Poll/components/RelationArticleInfoComponent';
import commonUtil from '@utils/commonUtil';
import { useHistory } from 'react-router-dom';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { unescapeHtml } from '@utils/convertUtil';
import { useDispatch, useSelector } from 'react-redux';
import { getPoll, getPollList, updatePoll } from '@store/survey/poll/pollAction';
const RelationPollModal = React.lazy(() => import('@pages/Survey/Poll/modals/RelationPollModal'));

const PollChildRelation = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [edit, setEdit] = useState({});
    const [isPollModalShow, setIsPollModalShow] = useState(false);
    const [isArticleModalShow, setIsArticleModalShow] = useState(false);
    const [relationPolls, setRelationPolls] = useState([]);
    const [selectPoll, setSelectPoll] = useState(null);
    const [relationArticles, setRelationArticles] = useState([]);
    const [selectArticle, setSelectArticle] = useState(null);

    const { poll, search, codes } = useSelector((store) => ({
        poll: store.poll.poll,
        search: store.poll.search,
        codes: store.poll.codes,
    }));

    const handleClickRelationPollAdd = (row) => {
        setSelectPoll(row);
        /*if (relationPolls.filter((poll) => poll.id === data.id).length > 0) {
            toast.warning(`중복된 투표정보(id=${data.id})가 존재합니다.`);
        } else {
            setRelationPolls([...relationPolls, { id: data.id, title: data.title }]);
        }*/
    };

    const handleClickArticleAdd = (row) => {
        setSelectArticle(row);
    };

    const handleClickRelationPollDelete = (id) => {
        setRelationPolls(relationPolls.filter((poll) => poll.contentId !== id));
    };

    const handleClickArticleModalShow = () => {
        if (commonUtil.isEmpty(edit.pollSeq)) {
            toast.warning('투표 정보를 먼저 등록해 주세요');
        } else {
            setIsArticleModalShow(true);
        }
    };

    const handleClickSearch = () => {
        setIsPollModalShow(true);
    };
    const handleClickPollModalClose = () => {
        setIsPollModalShow(false);
    };

    const handleClickRelationArticleAdd = (data) => {
        if (commonUtil.isEmpty(data)) {
            setRelationArticles([...relationArticles, { url: '', title: '' }]);
        }
    };

    const handleClickRelationArticleDelete = (id) => {
        const article = relationArticles.filter((data, index) => index !== id);
        setRelationArticles(article);
        setEdit({ ...edit, pollRelateContents: [...relationPolls, ...article] });
    };

    const handleChangeSave = () => {
        if (commonUtil.isEmpty(edit.pollSeq)) {
            toast.warning('투표 정보를 먼저 등록해 주세요');
        } else {
            dispatch(
                updatePoll({
                    data: edit,
                    callback: (response) => {
                        dispatch(getPoll(response.body.pollSeq));
                        dispatch(getPollList({ search }));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    useEffect(() => {
        if (selectArticle) {
            const { artTitle: title, totalId } = selectArticle;
            const articles = [...relationArticles, { title, linkUrl: `https://news.joins.com/article/${totalId}`, relType: 'A', pollSeq: poll.pollSeq, contentId: totalId }];
            setRelationArticles(articles);
            setEdit({ ...edit, pollRelateContents: [...relationPolls, ...articles] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticle]);

    useEffect(() => {
        if (selectPoll) {
            const polls = [...relationPolls, { title: selectPoll.title, pollSeq: poll.pollSeq, relType: 'P', contentId: selectPoll.id }];
            setRelationPolls(polls);
            setEdit({ ...edit, pollRelateContents: [...relationArticles, ...polls] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPoll]);

    useEffect(() => {
        if (edit.pollRelateContents) {
            setRelationPolls(edit.pollRelateContents.filter((data) => data.relType === 'P'));
            setRelationArticles(edit.pollRelateContents.filter((data) => data.relType === 'A'));
        } else {
            setRelationPolls([]);
            setRelationArticles([]);
        }
    }, [edit.pollRelateContents]);

    useEffect(() => {
        setEdit(poll);
    }, [poll]);

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
                    { text: '저장', variant: 'positive', onClick: handleChangeSave, className: 'mr-05' },
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
                                <RelationPollInfoComponent key={index} id={relationPoll.contentId} title={relationPoll.title} onDelete={handleClickRelationPollDelete} />
                            ))}
                    </Form.Group>
                    <hr />
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="pr-2 mb-0">관련 정보</Form.Label>
                                    <Button variant="positive" onClick={handleClickArticleModalShow} className="mr-2">
                                        기사 검색
                                    </Button>
                                    <Button variant="positive" onClick={handleClickRelationArticleAdd}>
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
                                    title={unescapeHtml(relationArticle.title)}
                                    url={relationArticle.linkUrl && relationArticle.linkUrl}
                                    onDelete={handleClickRelationArticleDelete}
                                />
                            ))}
                    </Form.Group>
                </Form>
            </MokaCard>
            <ArticleListModal show={isArticleModalShow} onHide={() => setIsArticleModalShow(false)} onRowClicked={handleClickArticleAdd} relationArticles={relationArticles} />
            <RelationPollModal show={isPollModalShow} onHide={handleClickPollModalClose} onAdd={handleClickRelationPollAdd} codes={codes} />
        </div>
    );
};

export default PollChildRelation;
