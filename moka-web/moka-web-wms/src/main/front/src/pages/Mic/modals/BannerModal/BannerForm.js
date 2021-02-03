import React, { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel } from '@components';

/**
 * 배너 수정/등록
 */
const BannerForm = ({ banner, onCancle, onSave, loading }) => {
    const [temp, setTemp] = useState({});
    const fileRef = useRef(null);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

    /**
     * 이미지 파일 변경
     */
    const setFileValue = (data) => {
        setTemp({
            ...temp,
            imgFile: data,
        });
    };

    useEffect(() => {
        setTemp(banner);
    }, [banner]);

    return (
        <MokaCard
            title={temp.bnnrSeq ? '공통 배너 수정' : '공통 배너 등록'}
            className="shadow-none w-100 h-100"
            headerClassName="pt-0"
            bodyClassName="pr-0"
            footerClassName="justify-content-center pb-0 mr-0"
            footer
            footerButtons={[
                { text: '저장', variant: 'positive', className: 'mr-2', onClick: () => onSave(temp) },
                { text: '취소', variant: 'negative', onClick: onCancle },
            ]}
            loading={loading}
        >
            <MokaInputLabel
                as="imageFile"
                label={
                    <React.Fragment>
                        배너이미지
                        <br />
                        <Button
                            variant="positive"
                            className="mt-1"
                            size="sm"
                            onClick={(e) => {
                                fileRef.current.rootRef.onClick(e);
                            }}
                        >
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                ref={fileRef}
                inputProps={{ img: temp.imgLink, width: 280, deleteButton: true, setFileValue }}
                className="mb-2"
            />
            <MokaInputLabel label="링크 주소" name="linkUrl" value={temp.linkUrl} onChange={handleChangeValue} />
        </MokaCard>
    );
};

export default BannerForm;
