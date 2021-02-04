import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaImage, MokaIcon } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

/**
 * 관련기사
 */
const RelArticleForm = ({ agenda, onChange }) => {
    const { relArticleList = [] } = agenda;
    const [show, setShow] = useState(false);
    const PDS_URL = useSelector(({ app }) => app.PDS_URL);

    /**
     * 제목 변경
     * @param {object} e 이벤트
     * @param {number} idx 기사 index
     */
    const handleChangeTitle = (e, idx) => {
        const { value } = e.target;
        const nlist = produce(relArticleList, (draft) => {
            const no = {
                ...relArticleList[idx],
                artTitle: value,
            };
            draft.splice(idx, 1, no);
        });
        onChange({
            key: 'relArticleList',
            value: nlist,
        });
    };

    /**
     * 관련기사 삭제
     * @param {number} idx 삭제하려는 기사 index
     */
    const handleDeleteArticle = (idx) => {
        const nlist = produce(relArticleList, (draft) => {
            draft.splice(idx, 1);
        });
        onChange({
            key: 'relArticleList',
            value: nlist,
        });
    };

    /**
     * 관련기사 추가
     * @param {object} articleData 기사데이터
     */
    const handleAddArticle = (articleData) => {
        // 1. 관련기사는 최대 4개까지만 추가
        if (relArticleList.length > 3) {
            messageBox.alert('관련기사는 4개까지 등록 가능합니다.\n현재 기사를 추가하고 싶을 경우, 등록된 다른 관련기사를 삭제해주세요.');
            return;
        }

        // 2. 동일한 기사 체크
        // if (relArticleList.filter((a) => a.totalId === articleData.totalId).length > 0) {
        //     messageBox.alert('이미 등록된 기사입니다.');
        //     return;
        // }

        // 3. 기사 추가
        const nlist = produce(relArticleList, (draft) => {
            draft.push({
                agndSeq: agenda.agndSeq,
                totalId: articleData.totalId,
                artTitle: unescapeHtmlArticle(articleData.artTitle),
                artThumb: articleData.artThumb ? `${PDS_URL}${articleData.artThumb}` : null,
            });
        });

        onChange({
            key: 'relArticleList',
            value: nlist,
        });

        toast.success('등록하였습니다.');
        setShow(false);
    };

    return (
        <React.Fragment>
            <div className="mb-3 d-flex">
                <MokaInputLabel label="관련 정보" labelWidth={90} as="none" />
                <Button variant="searching" onClick={() => setShow(true)}>
                    기사 검색
                </Button>
            </div>

            {relArticleList.length < 1 && (
                <div className="mb-2 p-3 bg-light d-flex align-items-center justify-content-center">
                    <p className="font-weight-bold">관련 기사가 없습니다</p>
                </div>
            )}

            {relArticleList.map((article, idx) => (
                <div key={article.totalId} className="mb-2 p-3 bg-light">
                    <p className="mb-0 font-weight-bold">관련기사 {idx + 1}</p>
                    <div className="d-flex align-items-center">
                        <MokaInputLabel
                            as="none"
                            label={
                                <React.Fragment>
                                    <Button variant="gray-700" size="sm" className="w-100">
                                        신규등록
                                    </Button>
                                    <Button variant="outline-gray-700" size="sm" className="mt-1 w-100">
                                        편집
                                    </Button>
                                </React.Fragment>
                            }
                        />
                        {/* 썸네일 이미지 */}
                        <MokaImage img={article.artThumb} width={178} height={100} />
                        {/* 기사 ID, 제목 노출 */}
                        <div className="flex-fill pl-3">
                            <MokaInputLabel label="기사ID" labelWidth={40} className="mb-2" name="totalId" value={article.totalId} disabled />
                            <MokaInputLabel
                                label="제목"
                                labelWidth={40}
                                name="artTitle"
                                value={unescapeHtmlArticle(article.artTitle)}
                                onChange={(e) => handleChangeTitle(e, idx)}
                            />
                        </div>
                        {/* 기사 삭제버튼 */}
                        <div className="pl-3 flex-shrink-0">
                            <Button variant="white" className="border-0 p-0 bg-transparent" onClick={() => handleDeleteArticle(idx)}>
                                <MokaIcon iconName="fas-minus-circle" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* 관련기사 모달 */}
            <ArticleListModal show={show} onHide={() => setShow(false)} onRowClicked={handleAddArticle} />
        </React.Fragment>
    );
};

export default RelArticleForm;
