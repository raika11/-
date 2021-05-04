import React, { useState } from 'react';
import { MokaSearchInput, MokaInput } from '@components';
import Badge from './Badge';

/**
 * 채널타입 6 폼
 */
const ChannelType6Form = ({ scb, onChangeValue }) => {
    const [editable, setEditable] = useState('');

    return (
        <React.Fragment>
            <p className="mb-2">중앙일보 개별 페이지 대상입니다.</p>
            <div className="flex-fill input-border px-12 py-2 mb-12 custom-scroll">
                <div className="mb-2">
                    <span>개별 페이지 URL 등록</span>
                </div>
                <MokaSearchInput
                    className="mb-2"
                    value={editable}
                    searchText="확인"
                    onSearch={() => {
                        setEditable('');
                        onChangeValue({
                            url: editable,
                        });
                    }}
                    buttonVariant="positive"
                    onChange={(e) => setEditable(e.target.value)}
                    placeholder="개별 페이지 URL을 입력하세요"
                />
                {scb.url && (
                    <React.Fragment>
                        <div className="input-border p-1 mb-1 overflow-hidden" style={{ height: 33 }}>
                            <Badge text={scb.url} index={0} onDelete={() => onChangeValue({ url: '' })} />
                        </div>
                        <MokaInput
                            as="checkbox"
                            id="subCat"
                            className="float-right"
                            inputProps={{ label: '하위 카테고리 포함', checked: scb.subCat === 'Y' }}
                            onChange={(e) => onChangeValue({ subCat: e.target.checked ? 'Y' : 'N' })}
                        />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default ChannelType6Form;
