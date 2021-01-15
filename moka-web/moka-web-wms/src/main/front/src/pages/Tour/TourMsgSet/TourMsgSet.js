import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaInputLabel } from '@/components';

const MessageSettings = () => {
    return (
        <>
            <Helmet>
                <title>견학 메세지 설정</title>
                <meta name="description" content="견학 메세지 설정 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard
                width={772}
                title="견학 메세지 설정"
                titleClassName="mb-0"
                footer
                footerButtons={[
                    { text: '저장', variant: 'positive', className: 'mr-2' },
                    { text: '취소', variant: 'negative' },
                ]}
                footerClassName="justify-content-center"
            >
                <MokaInputLabel
                    label="견학 신청/안내\n'신청 방법'"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    // name=""
                    // value={}
                    onChange={(e) => e.target.value}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\'견학 신청'"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    // name=""
                    // value={}
                    onChange={(e) => e.target.value}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\n'견학 시 유의사항'"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    // name=""
                    // value={}
                    onChange={(e) => e.target.value}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="견학 신청/안내\n'관람 및 주차 안내'"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 4 }}
                    // name=""
                    // value={}
                    onChange={(e) => e.target.value}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="질의응답\n'자주하는 질문'"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 9 }}
                    // name=""
                    // value={}
                    onChange={(e) => e.target.value}
                    // isInvalid={}
                />
            </MokaCard>
        </>
    );
};

export default MessageSettings;
