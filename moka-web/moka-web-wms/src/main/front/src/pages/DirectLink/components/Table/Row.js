import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { MokaImage, MokaIcon } from '@components';

const Row = ({ data, onRowClicked, selected, lastRow }) => {
    const [regInfo, setRegInfo] = useState(''); // 등록자명, 아이디
    const [modInfo, setModInfo] = useState(''); // 수정자명, 아이디

    useEffect(() => {
        if (data.regMember) {
            let w = `${data.regMember?.memberNm || ''}`;
            w += data.regMember?.memberId ? `(${data.regMember?.memberId})` : '';
            setRegInfo(w);
        }
        if (data.modMember) {
            let w = `${data.modMember?.memberNm || ''}`;
            w += data.modMember?.memberId ? `(${data.modMember?.memberId})` : '';
            setModInfo(w);
        }
    }, [data.regMember, data.modMember]);

    return (
        <div
            className={clsx('table-row input-border p-2 d-flex cursor-pointer', {
                'mb-2': !lastRow,
                'selected-row': selected,
            })}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRowClicked(data);
            }}
        >
            {/* 좌측 이미지 */}
            <MokaImage className="mr-3 flex-shrink-0 border" width={120} height={100} img={data.imgUrl || '//pds.joins.com/news/search_direct_link/000.jpg'} inputBorder={false} />

            {/* 우측 컨텐츠 */}
            <div className="flex-fill overflow-hidden color-searching" style={{ fontSize: '14px' }}>
                <h3 className="w-100">
                    {data.linkTitle}&nbsp;(&nbsp;
                    <a
                        target="_blank"
                        href={data.linkUrl}
                        className="color-gray-800"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(data.linkUrl);
                        }}
                    >
                        {data.linkUrl}
                    </a>
                    &nbsp;)
                </h3>
                <p className="text-truncate w-100">{data.linkContent}</p>
                <div className="d-flex justify-content-between w-100">
                    <div className="d-flex flex-fill">
                        <div style={{ width: 272 }}>
                            <p className="mb-0">시작일&nbsp;{data.viewSdate}</p>
                        </div>
                        <div style={{ width: 272 }}>
                            <p className="mb-0">종료일&nbsp;{data.viewEdate}</p>
                        </div>
                    </div>
                    <p className="mb-0 mr-10">
                        <MokaIcon
                            iconName="fas-circle"
                            className={clsx('mr-1', {
                                'color-primary': data.usedYn === 'Y',
                                'color-gray-200': data.usedYn === 'N',
                            })}
                        />
                        {data.usedYn === 'Y' ? '사용 중' : '미사용'}&nbsp;/&nbsp;{data.fixYn === 'Y' ? '항상 노출' : '검색시만 노출'}
                    </p>
                </div>
                <div className="d-flex">
                    <div style={{ width: 272 }}>
                        <p className="mb-0">
                            등록일&nbsp;{(data.regDt || '').slice(0, -3)}&nbsp;{regInfo}
                        </p>
                    </div>
                    <div style={{ width: 272 }}>
                        {data.modDt && (
                            <p className="mb-0">
                                수정일&nbsp;{(data.modDt || '').slice(0, -3)}&nbsp;{modInfo}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Row;
