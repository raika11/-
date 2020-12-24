import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import EditThumbCard from './EditThumbCard';
import { getArticleImageList } from '@store/article';
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
 * 기사 내 이미지 목록 테이블
 */
const EditThumbArticleImageListTable = (props) => {
    const { loading, deskingWorkData, onRepClick } = props;
    const dispatch = useDispatch();
    const imageList = useSelector((store) => store.article.imageList);
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
                thumbPath: data.compFileUrl,
            })),
        );
    }, [imageList]);

    return (
        <div className="border rounded w-100 custom-scroll flex-fill overflow-hidden overflow-y-scroll">
            <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                {loading && <MokaLoader />}
                {renderList.map((data) => (
                    <EditThumbCard key={data.seqNo} img={data.thumbPath} data={data} dataType={data.dataType} onRepClick={onRepClick} articleImg />
                ))}
            </div>
        </div>
    );
};

EditThumbArticleImageListTable.propTypes = propTypes;
EditThumbArticleImageListTable.defaultProps = defaultProps;

export default EditThumbArticleImageListTable;
