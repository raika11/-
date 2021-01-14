import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import EditThumbCard from './EditThumbCard';
import { GET_ARTICLE_IMAGE_LIST, getArticleImageList } from '@store/article';
import { MokaLoader } from '@/components';

const propTypes = {
    /**
     * 대표 사진 변경 함수
     */
    setRepPhoto: PropTypes.func,
    /**
     * 대표 사진 버튼 click e
     */
    onRepClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 기사 내 이미지 목록
 */
const EditThumbArticleImageList = (props) => {
    const { deskingWorkData, onRepClick } = props;
    const dispatch = useDispatch();
    const imageList = useSelector((store) => store.article.imageList);
    const loading = useSelector((store) => store.loading[GET_ARTICLE_IMAGE_LIST]);
    const PDS_URL = useSelector((store) => store.app.PDS_URL);
    const [renderList, setRenderList] = useState([]);

    useEffect(() => {
        dispatch(
            getArticleImageList({
                totalId: deskingWorkData?.contentId,
            }),
        );
    }, [deskingWorkData.contentId, dispatch]);

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
            <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                {loading && <MokaLoader />}
                {renderList.map((data) => (
                    <EditThumbCard width={226} height={188} key={data.seqNo} img={data.thumbPath} data={data} dataType={data.dataType} onRepClick={onRepClick} articleImg />
                ))}
            </div>
        </div>
    );
};

EditThumbArticleImageList.propTypes = propTypes;
EditThumbArticleImageList.defaultProps = defaultProps;

export default EditThumbArticleImageList;
