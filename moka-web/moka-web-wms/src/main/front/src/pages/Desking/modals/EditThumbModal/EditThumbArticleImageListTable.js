import React, { useEffect } from 'react';
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
 * 아티클 기사 이미지 목록 테이블
 */
const EditThumbArticleImageListTable = (props) => {
    const { loading, deskingWorkData, onRepClick } = props;
    const dispatch = useDispatch();

    const imageList = useSelector((store) => store.article.imageList);

    useEffect(() => {
        dispatch(
            getArticleImageList({
                totalId: deskingWorkData.contentId,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="border rounded w-100 custom-scroll flex-fill overflow-hidden overflow-y-scroll">
            <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                {loading && <MokaLoader />}
                {imageList.map((data) => (
                    <EditThumbCard key={data.seqNo} img={data.compFileUrl} data={{ ...data, id: data.seqNo }} onRepClick={onRepClick} articleImg />
                ))}
            </div>
        </div>
    );
};

EditThumbArticleImageListTable.propTypes = propTypes;
EditThumbArticleImageListTable.defaultProps = defaultProps;

export default EditThumbArticleImageListTable;
