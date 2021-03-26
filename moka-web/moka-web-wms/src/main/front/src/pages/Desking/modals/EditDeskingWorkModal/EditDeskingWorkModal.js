import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { GET_BULK_CHAR, GET_DS_FONT_IMGD, GET_DS_FONT_IMGW, GET_DS_FONT_VODD, GET_DS_ICON, GET_DS_PRE, GET_DS_PRE_LOC, GET_DS_TITLE_LOC } from '@store/codeMgt';
import { PUT_DESKING_WORK, POST_DESKING_WORK } from '@store/desking';
import { MokaModal } from '@components';
import ImageForm from './ImageForm';
import SpecialCharForm from './SpecialCharForm';
import IconForm from './IconForm';
import TitleForm from './TitleForm';
import TextForm from './TextForm';
import TitleLocForm from './TitleLocForm';
import TitlePrefixForm from './TitlePrefixForm';
import VodUrlForm from './VodUrlForm';
import ContentPriorityForm from './ContentPriorityForm';
import mapping, { fontSizeObj } from '@pages/Desking/deskingPartMapping';

const propTypes = {
    /**
     * 기사워크 정보
     */
    deskingWorkData: PropTypes.shape({
        /**
         * 기사인 경우 기사아이디와 동일, 공백기사인 경우 D로 시작하는 컨텐츠ID
         */
        contentId: PropTypes.string,
    }),
    /**
     * 컴포넌트 정보
     */
    component: PropTypes.shape({}),
    /**
     * 편집영역에서 설정한 수정할 수 있는 파트, 파트에 따라 폼이 달라진다
     */
    deskingPart: PropTypes.string,
    /**
     * 공백기사 여부 (기본값 false)
     * @default
     */
    isDummy: PropTypes.bool,
    /**
     * 저장 함수
     */
    onSave: PropTypes.func.isRequired,
};

const defaultProps = {
    deskingWorkData: {},
    isDummy: false,
};

/**
 * 데스킹 기사정보 편집 모달
 */
const EditDeskingWorkModal = (props) => {
    const { show, onHide, deskingWorkData, component, onSave, deskingPart, isDummy } = props;
    const loading = useSelector(
        ({ loading }) =>
            loading[PUT_DESKING_WORK] ||
            loading[POST_DESKING_WORK] ||
            loading[GET_BULK_CHAR] ||
            loading[GET_DS_FONT_IMGD] ||
            loading[GET_DS_FONT_IMGW] ||
            loading[GET_DS_FONT_VODD] ||
            loading[GET_DS_ICON] ||
            loading[GET_DS_PRE] ||
            loading[GET_DS_PRE_LOC] ||
            loading[GET_DS_TITLE_LOC],
    );
    // const { IR_URL, PHOTO_ARCHIVE_URL } = useSelector((store) => ({
    //     IR_URL: store.app.IR_URL,
    //     PHOTO_ARCHIVE_URL: store.app.PHOTO_ARCHIVE_URL,
    // }));

    // state
    const [parts, setParts] = useState([]); // area의 deskingPart 리스트
    const [error, setError] = useState({});
    const [temp, setTemp] = useState({}); // 폼 데이터

    /**
     * 유효성 검증
     */
    const validate = () => {
        let invalid = false,
            obj = {};
        const mappingList = Object.values(mapping);

        // temp -> 리스트 변환 후 루프돌며 mapping의 regex에 따라 error 처리
        Object.keys(temp).forEach((camelKey) => {
            if (deskingPart.indexOf(camelKey) < 0) return false;

            const mappingData = mappingList.find((m) => m.field === camelKey);
            if (!mappingData) return false;

            const { errorCheck, regex } = mappingData;
            if (errorCheck) {
                if (!regex.test(temp[camelKey])) {
                    invalid = invalid || true;
                    obj[camelKey] = true;
                }
            }
        });

        setError({ ...obj });
        return !invalid;
    };

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

    /**
     * 수정/저장
     */
    const handleClickSave = () => {
        if (validate()) {
            onSave(temp, ({ header }) => {
                if (!header.success) {
                    messageBox.alert(header.message);
                } else {
                    handleHide();
                }
            });
        }
    };

    /**
     * 모달 닫기
     */
    const handleHide = useCallback(() => {
        setTemp({});
        setError({});
        onHide();
    }, [onHide]);

    useEffect(() => {
        show &&
            (() => {
                const irImg = deskingWorkData?.thumbFileName;
                // `${IR_URL}?t=k&w=216&h=150u=//${deskingWorkData.thumbFileName}`
                setTemp({
                    ...deskingWorkData,
                    title: unescapeHtmlArticle(deskingWorkData.title),
                    subTitle: unescapeHtmlArticle(deskingWorkData.subTitle),
                    bodyHead: unescapeHtmlArticle(deskingWorkData.bodyHead),
                    nameplate: unescapeHtmlArticle(deskingWorkData.nameplate),
                    irImg,
                });
            })();
    }, [deskingWorkData, show]);

    useEffect(() => {
        // 폰트사이즈를 제외한 파트리스트
        setParts((deskingPart || '').split(',').filter((partKey) => !fontSizeObj[partKey]));
    }, [deskingPart]);

    useEffect(() => {
        return () => {
            setTemp({});
            setError({});
        };
    }, []);

    return (
        <MokaModal
            titleAs={
                !isDummy && (
                    <div className="w-100 d-flex flex-column">
                        <div className="d-flex h2 mb-0 user-select-text">
                            <p className="m-0 mr-2">{deskingWorkData.rel ? `0${deskingWorkData.relOrd}`.substr(-2) : `0${deskingWorkData.contentOrd}`.substr(-2)}</p>
                            <p className="m-0">{deskingWorkData.title}</p>
                        </div>
                        <div className="d-flex user-select-text">
                            <p className="m-0 mr-3">ID: {deskingWorkData.contentId}</p>
                            <p className="m-0">
                                (cp{component.componentSeq} {component.componentName})
                            </p>
                        </div>
                    </div>
                )
            }
            title={isDummy ? '공백 기사' : undefined}
            width={650}
            size="lg"
            show={show}
            onHide={onHide}
            buttons={[
                { variant: 'positive', text: isDummy ? '저장' : '수정', onClick: handleClickSave },
                { variant: 'negative', text: '취소', onClick: handleHide },
            ]}
            bodyClassName="custom-scroll"
            loading={loading}
            draggable
            id={`cid-${deskingWorkData.contentId}`}
        >
            {parts.map((partKey) => {
                const mappingData = mapping[partKey];

                // 제목 + 폰트사이즈(기타코드)
                if (partKey === 'TITLE') {
                    return <TitleForm key={partKey} show={show} mappingData={mappingData} onChange={handleChangeValue} deskingPart={deskingPart} temp={temp} error={error} />;
                }
                // 대표이미지
                else if (partKey === 'THUMB_FILE_NAME') {
                    return (
                        <ImageForm
                            key={partKey}
                            component={component}
                            contentId={!isDummy ? deskingWorkData?.contentId : undefined} // 데스킹워크의 contentId (있으면 대표이미지 변경 모달에서 본문 내 이미지 조회)
                            mappingData={mappingData}
                            onChange={({ thumbnailFile, imageSrc }) => setTemp({ ...temp, irImg: imageSrc, thumbnailFile, thumbFileName: imageSrc })}
                            temp={temp}
                            fileName={deskingWorkData.seq}
                        />
                    );
                }
                // 약물(기타코드)
                else if (partKey === 'SPECIAL_CHAR') {
                    return <SpecialCharForm show={show} key={partKey} />;
                }
                // 아이콘(기타코드)
                else if (partKey === 'ICON_FILE_NAME') {
                    return <IconForm show={show} key={partKey} temp={temp} setTemp={setTemp} onChange={handleChangeValue} />;
                }
                // 말머리(기타코드)
                else if (partKey === 'TITLE_PREFIX') {
                    return <TitlePrefixForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} deskingPart={deskingPart} />;
                }
                // 제목/부제위치(기타코드)
                else if (partKey === 'TITLE_LOC') {
                    return <TitleLocForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} />;
                }
                // 영상
                else if (partKey === 'VOD_URL') {
                    return <VodUrlForm show={show} key={partKey} temp={temp} setTemp={setTemp} />;
                }
                // 중요도
                else if (partKey === 'CONTENT_PRIORITY') {
                    return <ContentPriorityForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} />;
                }
                // 그 외
                else if (mappingData) {
                    return <TextForm key={partKey} mappingData={mappingData} temp={temp} onChange={handleChangeValue} error={error} />;
                } else {
                    return null;
                }
            })}
        </MokaModal>
    );
};

EditDeskingWorkModal.propTypes = propTypes;
EditDeskingWorkModal.defaultProps = defaultProps;

export default EditDeskingWorkModal;
