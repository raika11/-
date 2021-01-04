import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReporterAllList } from '@store/reporter';
import { getArticleType } from '@store/codeMgt';
import { initialState, getArticle, GET_ARTICLE, clearArticle } from '@store/article';
import ArticleForm from '@pages/Article/components/ArticleForm';
import toast from '@utils/toastUtil';
import { popupPreview } from '@utils/commonUtil';
import { unescapeHtml } from '@utils/convertUtil';
import { API_BASE_URL } from '@/constants';

const ArticleEdit = () => {
    const { totalId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_ARTICLE]);
    const article = useSelector((store) => store.article.article);
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const allReporter = useSelector((store) => store.reporter.allReporter); // 전체 기자리스트
    const [reporterList, setReporterList] = useState([]);
    const [temp, setTemp] = useState(initialState.rcvArticle);

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
        history.push('/article');
        dispatch(clearArticle());
    };

    useEffect(() => {
        // 기사타입 조회
        if (!articleTypeRows) {
            dispatch(getArticleType());
        }
    }, [articleTypeRows, dispatch]);

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
                    value: article.totalId ? reporter.repSeq : `${reporter.repName}/${reporter.repEmail1}`,
                    label: reporter.repName,
                })),
            );
        }
    }, [allReporter, dispatch, article.totalId]);

    useEffect(() => {
        // 기사 상세 조회
        if (totalId) {
            dispatch(
                getArticle({
                    totalId,
                    callback: ({ header }) => {
                        if (!header.success) {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearArticle());
        }
    }, [dispatch, totalId]);

    useEffect(() => {
        setTemp({
            ...article,
            title: unescapeHtml(article.artTitle),
            subTitle: article.artSubTitle,
            pressDt: article.pressDate,
            // categoryList 중복인 마스터코드 제거
            categoryList: [...new Set(article.categoryList)],
        });
    }, [article]);

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = (servicePlatform) => {
        popupPreview(`${API_BASE_URL}/preview/rcv-article/${temp.rid}`, { ...temp, servicePlatform });
    };

    return (
        <React.Fragment>
            <ArticleForm
                article={temp}
                onChange={handleChangeValue}
                articleTypeRows={articleTypeRows}
                reporterList={reporterList || []}
                loading={loading}
                onCancle={handleCancle}
                onPreview={handleClickPreviewOpen}
            />
        </React.Fragment>
    );
};

export default ArticleEdit;
