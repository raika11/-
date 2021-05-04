import React from 'react';
import Form from 'react-bootstrap/Form';
import { messageBox } from '@utils/toastUtil';
import { MokaInput } from '@components';
import ChannelType0Form from './ChannelType0Form';
import ChannelType1Form from './ChannelType1Form';
import ChannelType2Form from './ChannelType2Form';
import ChannelType3Form from './ChannelType3Form';
import ChannelType4Form from './ChannelType4Form';
import ChannelType5Form from './ChannelType5Form';
import ChannelType6Form from './ChannelType6Form';
import DesignCommonForm from './DesignCommonForm';

/**
 * 구독 관리 > 구독 설계 > STEP1
 */
const DesignStep1Form = ({ scb, onChangeValue, CHANNEL_TYPE }) => {
    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'channelType') {
            messageBox.confirm(
                '다른 대상 구분으로 이동시 현재 입력된\n정보는 저장되지 않고, 초기화 됩니다.',
                () => {
                    onChangeValue(
                        {
                            // 초기값 데이터 추가해야함
                            [name]: value,
                            artView: value === CHANNEL_TYPE[0].code ? 'Y' : 'N',
                            myScb: value === CHANNEL_TYPE[2].code || value === CHANNEL_TYPE[3].code || value === CHANNEL_TYPE[5].code ? 'Y' : 'N',
                            newsletter: value === CHANNEL_TYPE[4].code ? 'Y' : 'N',
                        },
                        true,
                    );
                },
                () => {},
            );
        } else {
            onChangeValue({
                [name]: value,
            });
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            <p className="mb-2">구독 제안할 서비스 또는 콘텐츠를 설정합니다.</p>
            <Form.Row className="mb-2">
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-1"
                    value={CHANNEL_TYPE[0].code}
                    inputProps={{ label: CHANNEL_TYPE[0].name, checked: scb.channelType === CHANNEL_TYPE[0].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-2"
                    value={CHANNEL_TYPE[1].code}
                    inputProps={{ label: CHANNEL_TYPE[1].name, checked: scb.channelType === CHANNEL_TYPE[1].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-3"
                    value={CHANNEL_TYPE[2].code}
                    inputProps={{ label: CHANNEL_TYPE[2].name, checked: scb.channelType === CHANNEL_TYPE[2].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-4"
                    value={CHANNEL_TYPE[3].code}
                    inputProps={{ label: CHANNEL_TYPE[3].name, checked: scb.channelType === CHANNEL_TYPE[3].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-5"
                    value={CHANNEL_TYPE[4].code}
                    inputProps={{ label: CHANNEL_TYPE[4].name, checked: scb.channelType === CHANNEL_TYPE[4].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-6"
                    value={CHANNEL_TYPE[5].code}
                    inputProps={{ label: CHANNEL_TYPE[5].name, checked: scb.channelType === CHANNEL_TYPE[5].code }}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    name="channelType"
                    id="radio-7"
                    value={CHANNEL_TYPE[6].code}
                    inputProps={{ label: CHANNEL_TYPE[6].name, checked: scb.channelType === CHANNEL_TYPE[6].code }}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 채널별 */}
            {scb.channelType === CHANNEL_TYPE[0].code && <ChannelType0Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[1].code && <ChannelType1Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[2].code && <ChannelType2Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[3].code && <ChannelType3Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[4].code && <ChannelType4Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[5].code && <ChannelType5Form scb={scb} onChangeValue={onChangeValue} />}
            {scb.channelType === CHANNEL_TYPE[6].code && <ChannelType6Form scb={scb} onChangeValue={onChangeValue} />}

            {/* 공통 */}
            <DesignCommonForm scb={scb} onChangeValue={onChangeValue} CHANNEL_TYPE={CHANNEL_TYPE} />
        </div>
    );
};

export default DesignStep1Form;
