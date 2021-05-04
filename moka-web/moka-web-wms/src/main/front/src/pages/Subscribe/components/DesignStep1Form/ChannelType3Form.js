import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from './Badge';
import { MokaInput } from '@components';

const defaultProps = {
    scb: {},
};

/**
 * 채널타입 3 폼
 */
const ChannelType3Form = ({ scb, onChangeValue }) => {
    const [selected, setSelected] = useState(null);

    return (
        <React.Fragment>
            <p className="mb-2">중앙일보의 패키지(/issue/#####)(/issueseries/#####) 기사를 대상으로 합니다.</p>
            <div className="flex-fill input-border px-12 py-2 mb-12 custom-scroll">
                <div className="d-flex align-items-center w-100 mb-2">
                    <span className="mr-3 flex-shrink-0">이슈 패키지 대상 선택</span>
                    <div className="flex-fill">
                        <MokaInput as="radio" inputProps={{ label: '이슈' }} className="float-left mr-3" />
                        <MokaInput as="radio" inputProps={{ label: '토픽' }} className="float-left mr-3" />
                        <MokaInput as="radio" inputProps={{ label: '연재' }} className="float-left mr-3" />
                    </div>
                    <Button variant="searching" size="sm" className="flex-shrink-0">
                        검색
                    </Button>
                </div>
                <div className="input-border p-1 custom-scroll mb-2" style={{ height: 48 }}>
                    {/* 이름(소속/이메일) => 소속이 정확히 어떤 데이터인지 확인 필요 */}
                    {selected && <Badge text={`${selected.repName}(${selected.r1CdNm}/${selected.repEmail1})`} index={0} onDelete={() => setSelected(null)} />}
                </div>
                <div className="d-flex align-items-center mb-2">
                    <MokaInput
                        as="checkbox"
                        name="mainYn"
                        id="mainYn"
                        inputProps={{ label: '대표 상품', checked: scb.mainYn === 'Y' }}
                        onChange={(e) => onChangeValue({ mainYn: e.target.checked ? 'Y' : 'N' })}
                    />
                    <Button className="flex-shrink-0" variant="searching" size="sm" disabled={scb.mainYn !== 'Y'}>
                        연관상품 검색
                    </Button>
                </div>
                <div className="input-border p-1 custom-scroll" style={{ height: 48, opacity: scb.mainYn !== 'Y' ? 0.5 : undefined }}>
                    <Badge text="출고 1년 된 기사(11293)" />
                    <Badge text="출고 1년 된 기사(11293)" />
                    <Badge text="출고 1년 된 기사(11293)" />
                </div>
            </div>
        </React.Fragment>
    );
};

ChannelType3Form.defaultProps = defaultProps;

export default ChannelType3Form;
