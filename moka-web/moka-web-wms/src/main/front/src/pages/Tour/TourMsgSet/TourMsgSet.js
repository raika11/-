import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaInputLabel } from '@/components';
import toast from '@/utils/toastUtil';
import { MokaEditorCore } from '@/components/MokaEditor';
import { clearStore, getTourGuideList, putTourGuideList } from '@/store/tour';

/**
 * 견학 메세지 설정
 */
const MessageSettings = ({ displayName }) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Helmet>
                <title>견학 {displayName}</title>
                <meta name="description" content={`견학 ${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard
                className="w-100"
                title="견학 메시지 설정"
                footer
                footerButtons={[
                    { text: '저장', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                    { text: '취소', variant: 'negative', onClick: handleClickCancel },
                ]}
                footerClassName="justify-content-center"
            >
                <Container className="p-0">
                    <Row className="m-0">
                        <Col xs={6} className="pl-0 d-flex flex-column" style={{ paddingRight: 15 }}>
                            <MokaInputLabel
                                label="견학 신청/안내\n'신청 방법'"
                                className="mb-2"
                                as="textarea"
                                inputClassName="resize-none"
                                inputProps={{ rows: 7 }}
                                name="A"
                                value={mgObj.A}
                                onChange={handleChangeValue}
                                // isInvalid={}
                            />
                            <MokaInputLabel
                                label="견학 신청/안내\n'견학 신청'"
                                className="mb-2"
                                as="textarea"
                                inputClassName="resize-none"
                                inputProps={{ rows: 7 }}
                                name="B"
                                value={mgObj.B}
                                onChange={handleChangeValue}
                                // isInvalid={}
                            />
                            <MokaInputLabel
                                label="견학 신청/안내\n'견학 시 유의사항'"
                                className="mb-2"
                                as="textarea"
                                inputClassName="resize-none"
                                inputProps={{ rows: 7 }}
                                name="C"
                                value={mgObj.C}
                                onChange={handleChangeValue}
                                // isInvalid={}
                            />
                            <MokaInputLabel
                                label="견학 신청/안내\n'관람 및 주차 안내'"
                                as="textarea"
                                inputClassName="resize-none"
                                inputProps={{ rows: 7 }}
                                name="D"
                                value={mgObj.D}
                                onChange={handleChangeValue}
                                // isInvalid={}
                            />
                        </Col>
                        <Col xs={6} className="pr-0 d-flex flex-column" style={{ paddingLeft: 15 }}>
                            <div className="d-flex flex-fill">
                                <MokaInputLabel label="질의응답\n'자주하는 질문'" as="none" />
                                <div className="flex-fill input-border overflow-hidden">
                                    <MokaEditorCore value={mgObj.E} onBlur={handleBlur} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </MokaCard>
        </>
    );
};

export default MessageSettings;
