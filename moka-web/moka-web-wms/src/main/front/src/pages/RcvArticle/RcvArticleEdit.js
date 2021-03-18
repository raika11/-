import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReporterAllList } from '@store/reporter';
import { getArticleType } from '@store/codeMgt';
import { initialState, getRcvArticle, clearRcvArticle, GET_RCV_ARTICLE, postRcvArticle, POST_RCV_ARTICLE, getRcvArticleList } from '@store/rcvArticle';
import ArticleForm from '@pages/Article/components/ArticleForm/index';
import RctArticleForm from './components/RcvArticleForm';
import toast, { messageBox } from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { API_BASE_URL } from '@/constants';

const RcvArticleEdit = ({ match }) => {
    const { rid, registerable } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_RCV_ARTICLE] || store.loading[POST_RCV_ARTICLE]);
    const { search, rcvArticle } = useSelector(({ rcvArticle }) => rcvArticle);
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const allReporter = useSelector((store) => store.reporter.allReporter); // 전체 기자리스트
    const [registed, setRegisted] = useState(false); // 등록된 기사이면 등록폼으로 연결
    const [reporterList, setReporterList] = useState([]);
    const [temp, setTemp] = useState(initialState.rcvArticle);
    const [error, setError] = useState({});

    /**
     * temp 값 변경
     */
    const handleChangeValue = ({ key, value }) => {
        setTemp({
            ...temp,
            [key]: value,
        });
    };

    /**
     * 취소
     */
    const handleCancle = () => {
        history.push(match.path);
    };

    /**
     * 수신기사 등록
     */
    const handleRegister = () => {
        if (!REQUIRED_REGEX.test(temp.categoryList.join(''))) {
            setError({ ...error, categoryList: true });
        } else {
            dispatch(
                postRcvArticle({
                    rid: temp.rid,
                    rcvArticle: {
                        categoryList: temp.categoryList,
                        reporterList: temp.reporterList,
                        tagList: temp.tagList,
                    },
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(match.path, { update: true });
                            // dispatch(clearRcvArticle());
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 등록기사 수정 후
     */
    const reloadList = () => dispatch(getRcvArticleList({ search }));

    useEffect(() => {
        // 기사타입 조회
        if (!articleTypeRows) {
            dispatch(getArticleType());
        }
    }, [articleTypeRows, dispatch]);

    useEffect(() => {
        // 수신 => 등록 간의 시간 차이가 존재...
        setRegisted(false);
    }, [rid]);

    useEffect(() => {
        // 기사 상세 조회
        if (rid) {
            dispatch(
                getRcvArticle({
                    rid,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message, () => {
                                history.push(match.path);
                            });
                        } else {
                            if (registerable === 'Y') {
                                setRegisted(false);
                            } else {
                                // 등록기사 키가 있으면 ===> 등록기사 폼으로 연결
                                !body.totalId || body.totalId === 0 ? setRegisted(false) : setRegisted(true);
                            }
                        }
                    },
                }),
            );
        } else {
            dispatch(clearRcvArticle());
        }
    }, [dispatch, history, match.path, rid, registerable]);

    useEffect(() => {
        // 기자 리스트 조회
        if (!allReporter) {
            dispatch(getReporterAllList());
        } else {
            // 등록기사인 경우 동일 기자 비교 => repSeq,
            // 수신기사인 경우 동일 기자 비교 => 기자명/기자이메일
            setReporterList(
                allReporter.map((reporter) => ({
                    ...reporter,
                    value: registed ? reporter.repSeq : `${reporter.repName}/${reporter.repEmail1}`,
                    label: reporter.repName,
                })),
            );
        }
    }, [allReporter, dispatch, registed]);

    useEffect(() => {
        return () => {
            dispatch(clearRcvArticle());
            setRegisted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTemp({
            ...rcvArticle,
            title: unescapeHtmlArticle(rcvArticle.title),
            // categoryList 중복인 마스터코드 제거
            categoryList: [...new Set(rcvArticle.categoryList)],
        });
    }, [rcvArticle]);

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = (domainId) => {
        commonUtil.winOpenPreview(`${API_BASE_URL}/preview/rcv-article/${temp.rid}`, { ...temp, domainId });
    };

    if (!rcvArticle.rid) return null;

    return (
        <React.Fragment>
            {/* 등록된 기사이면 등록기사 폼으로 연결한다 */}
            {registed ? (
                <ArticleForm
                    totalId={rcvArticle.totalId}
                    returnUrl="/rcv-article"
                    articleTypeRows={articleTypeRows}
                    reporterList={reporterList || []}
                    onCancle={handleCancle}
                    onSave={reloadList}
                    inRcv
                />
            ) : (
                <RctArticleForm
                    article={temp}
                    error={error}
                    setError={setError}
                    onChange={handleChangeValue}
                    articleTypeRows={articleTypeRows}
                    reporterList={reporterList || []}
                    loading={loading}
                    onCancle={handleCancle}
                    onPreview={handleClickPreviewOpen}
                    onRegister={handleRegister}
                    registerable={registerable}
                />
            )}
        </React.Fragment>
    );
};

export default RcvArticleEdit;
