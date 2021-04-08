import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ThumbCard from './ThumbCard';
import { GET_ARTICLE_IMAGE_LIST, getArticleImageList } from '@store/article';
import { MokaLoader } from '@/components';

const propTypes = {
    /**
     * 대표사진으로 지정
     */
    setRepImg: PropTypes.func,
};
const defaultProps = {};

/**
 * 기사 내 이미지 목록
 */
const ArticleImageList = (props) => {
    const { totalId, showPhotoDetail, setRepImg, repImg } = props;
    const dispatch = useDispatch();
    const imageList = useSelector(({ article }) => article.imageList);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_IMAGE_LIST]);
    const PDS_URL = useSelector(({ app }) => app.PDS_URL);
    const [renderList, setRenderList] = useState([]);

    useEffect(() => {
        dispatch(getArticleImageList({ totalId }));
    }, [totalId, dispatch]);

    useEffect(() => {
        setRenderList(
            imageList.map((data) => ({
                ...data,
                id: data.seqNo,
                dataType: 'article',
                compFileUrl: `${PDS_URL}${data.compFileUrl}`,
                thumbPath: `${PDS_URL}${data.compFileUrl}`,
                imageOnlnPath: `${PDS_URL}${data.compFileUrl}`,
            })),
        );
    }, [PDS_URL, imageList]);

    return (
        <div className="input-border w-100 custom-scroll flex-fill">
            <div className="d-flex flex-wrap align-content-start pt-10 pl-10 overflow-hidden">
                {loading && <MokaLoader />}
                {renderList.map((data) => (
                    <ThumbCard
                        className="mb-10 mr-10"
                        width={'calc(20% - 10px)'}
                        height={188}
                        boxShadow="0px 8px 10px -1px #bbb"
                        key={data.seqNo}
                        img={data.thumbPath}
                        data={data}
                        cardType="article"
                        showPhotoDetail={showPhotoDetail}
                        isRep={data.id === repImg?.id}
                        setRepImg={setRepImg}
                        articleImg
                    />
                ))}
            </div>
        </div>
    );
};

ArticleImageList.propTypes = propTypes;
ArticleImageList.defaultProps = defaultProps;

export default ArticleImageList;
