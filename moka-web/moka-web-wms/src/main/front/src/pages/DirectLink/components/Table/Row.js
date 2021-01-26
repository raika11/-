import React from 'react';
import clsx from 'clsx';
import { MokaImage, MokaIcon } from '@components';

const Row = ({ data, onRowClicked, selected, lastRow }) => {
    return (
        <div
            className={clsx('table-row input-border p-2 d-flex cursor-pointer', {
                'mb-2': !lastRow,
                selected: selected,
            })}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRowClicked(data);
            }}
        >
            <div className="mr-3 flex-shrink-0">
                <MokaImage width={120} height={100} imgClassName="w-100" img={data.imgUrl || '//pds.joins.com/news/search_direct_link/000.jpg'} />
            </div>
            <div className="flex-fill">
                <h3 className="w-100">
                    {data.linkTitle}&nbsp;(&nbsp;
                    <a
                        target="_blank"
                        href={data.linkUrl}
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
                <p className="w-100 color-searching pre-wrap">{data.linkContent}</p>
                <div className="d-flex w-100">
                    <p className="w-25 mb-0">시작일&nbsp;{data.viewSdate}</p>
                    <p className="w-25 mb-0">종료일&nbsp;{data.viewEdate}</p>
                    <p className="w-50 mb-0">
                        <MokaIcon
                            iconName="fas-circle"
                            className={clsx('mr-1', {
                                'color-primary': data.usedYn === 'Y',
                                'color-gray150': data.usedYn === 'N',
                            })}
                        />
                        {data.usedYn === 'Y' ? '사용 중' : '미사용'}&nbsp;/&nbsp;{data.fixYn === 'Y' ? '항상 노출' : '검색시만 노출'}
                    </p>
                </div>
                <p className="w-100 mb-0">
                    등록&nbsp;{data.regDt}&nbsp;{data.regId}
                </p>
                {data.modDt && (
                    <p className="w-100 mb-0">
                        수정&nbsp;{data.modDt}&nbsp;{data.modId}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Row;
