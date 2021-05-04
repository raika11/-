import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from './Badge';
import { MokaInput } from '@components';

const defaultProps = {
    scb: {},
};

/**
 * 채널타입 1 폼
 */
const ChannelType1Form = ({ scb, onChangeValue }) => {
    return (
        <React.Fragment>
            <p className="mb-2">중앙일보의 기사패키지를 지정합니다.</p>
            <div className="flex-fill input-border px-12 py-2 mb-12 custom-scroll">
                <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                    <span>기사패키지 선택</span>
                    <Button variant="searching" size="sm">
                        검색
                    </Button>
                </div>
                <div className="input-border p-1 custom-scroll mb-2" style={{ height: 48 }}>
                    <Badge text="출고 1년 된 기사(11293)" index={0} onDelete={() => {}} />
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

ChannelType1Form.defaultProps = defaultProps;

export default ChannelType1Form;
