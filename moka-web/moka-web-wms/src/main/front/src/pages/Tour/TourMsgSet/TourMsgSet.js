import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaInputLabel } from '@/components';
import toast from '@/utils/toastUtil';
import { MokaEditorCore } from '@/components/MokaEditor';
import { clearStore, getTourGuideList, putTourGuideList } from '@/store/tour';

/**
 * 견학 메세지 설정
 */
const MessageSettings = () => {
    const dispatch = useDispatch();
    const tourGuideList = useSelector((store) => store.tour.list);
    const [mgObj, setMgObj] = useState({});

    const handleBlur = (value) => {
        setMgObj({ ...mgObj, E: value });
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        let mgArr = [];
        Object.keys(mgObj).forEach((key) => mgArr.push({ guideType: key, guideMsg: mgObj[key] }));

        dispatch(
            putTourGuideList({
                tourGuideList: mgArr,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 취소 버튼 (서버에서 정보 조회)
     */
    const handleClickCancel = () => {
        dispatch(getTourGuideList());
    };

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setMgObj({ ...mgObj, [name]: value });
        },
        [mgObj],
    );

    useEffect(() => {
        dispatch(getTourGuideList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tourGuideList.length > 0) {
            tourGuideList.forEach((mg) => (mgObj[mg.guideType] = mg.guideMsg));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourGuideList]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>견학 메시지 설정</title>
                <meta name="description" content="견학 메시지 설정 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard
                width={772}
                title="견학 메시지 설정"
                bodyClassName="d-flex flex-column"
                footer
                footerButtons={[
                    { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                    { text: '취소', variant: 'negative', onClick: handleClickCancel },
                ]}
                footerClassName="justify-content-center"
            >
                <MokaInputLabel
                    label="견학 신청/안내\n'신청 방법'"
                    labelWidth={92}
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    name="A"
                    value={mgObj.A}
                    onChange={handleChangeValue}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\'견학 신청'"
                    labelWidth={92}
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    name="B"
                    value={mgObj.B}
                    onChange={handleChangeValue}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\n'견학 시 유의사항'"
                    labelWidth={92}
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    name="C"
                    value={mgObj.C}
                    onChange={handleChangeValue}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\n'관람 및 주차 안내'"
                    labelWidth={92}
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    name="D"
                    value={mgObj.D}
                    onChange={handleChangeValue}
                    // isInvalid={}
                />
                <div className="d-flex flex-fill">
                    <MokaInputLabel label="질의응답\n'자주하는 질문'" labelWidth={92} as="none" />
                    <div className="flex-fill input-border overflow-hidden">
                        <MokaEditorCore value={mgObj.E} onBlur={handleBlur} />
                    </div>
                </div>
            </MokaCard>
        </>
    );
};

export default MessageSettings;
