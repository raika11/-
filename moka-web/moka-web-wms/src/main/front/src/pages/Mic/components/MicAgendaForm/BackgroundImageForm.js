import React, { useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';

/**
 * 배경이미지(PC, M)
 */
const BackgroundImageForm = ({ className, agenda, onChange }) => {
    const pcImgRef = useRef(null);
    const mImgRef = useRef(null);

    /**
     * 이미지 파일 변경 (PC)
     */
    const setPcFileValue = (data) => {
        onChange({ agndImgFile: data });
        if (!data) {
            onChange({ agndImg: null });
        }
    };

    /**
     * 이미지 파일 변경 (M)
     */
    const setMFileValue = (data) => {
        onChange({ agndImgMobFile: data });
        if (!data) {
            onChange({ agndImgMob: null });
        }
    };

    useEffect(() => {
        // 키가 바뀌면 이미지미리보기 제거
        if (pcImgRef.current && !agenda.agndImg) {
            pcImgRef.current.imageHide();
        }
        if (mImgRef.current && !agenda.agndImgMob) {
            mImgRef.current.imageHide();
        }
    }, [agenda.agndImg, agenda.agndImgMob, agenda.agndSeq]);

    return (
        <Form.Row className={className}>
            <MokaInputLabel
                as="imageFile"
                ref={pcImgRef}
                className="mr-2"
                label={
                    <React.Fragment>
                        배경이미지
                        <br />
                        <span className="color-danger">
                            PC
                            <br />
                            800*600px
                        </span>
                        <Button
                            variant="gray-700"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                                pcImgRef.current.rootRef.onClick(e);
                            }}
                        >
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                inputProps={{ img: agenda.agndImg, width: 280, setFileValue: setPcFileValue, deleteButton: true, accept: 'image/jpeg, image/png' }}
            />
            <MokaInputLabel
                as="imageFile"
                ref={mImgRef}
                label={
                    <React.Fragment>
                        배경이미지
                        <br />
                        <span className="color-danger">
                            M<br />
                            600*500px
                        </span>
                        <Button
                            variant="gray-700"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                                mImgRef.current.rootRef.onClick(e);
                            }}
                        >
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                inputProps={{ img: agenda.agndImgMob, width: 280, setFileValue: setMFileValue, deleteButton: true, accept: 'image/jpeg, image/png' }}
            />
        </Form.Row>
    );
};

export default BackgroundImageForm;
