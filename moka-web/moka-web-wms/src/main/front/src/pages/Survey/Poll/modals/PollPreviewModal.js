import React, { useCallback, useEffect, useState } from 'react';
import { MokaCardTabs, MokaInput, MokaModal } from '@components';
import { getPreviewPoll } from '@store/survey/poll/pollAction';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const PollPreviewModal = ({ show, onHide, pollSeq }) => {
    const [data, setData] = useState({});
    const [html, setHtml] = useState('');

    const dispatch = useDispatch();

    const makeRelationHTML = (relations) => {
        let relationHTML = '';
        if (relations.length > 0) {
            const relation = relations[0];
            const linkUrl = relation.linkUrl;
            if (!commonUtil.isEmpty(linkUrl) && linkUrl !== '') {
                let cloc = '?cloc=joongang-home-hotpollrearticle';
                if (linkUrl.indexOf('?') > -1) {
                    cloc = '&cloc=joongang-home-hotpollrearticle';
                }
                relationHTML = `<a class="article" href="${linkUrl}${cloc}" target="_blank">
    <span>투표 전 관련기사 참고</span>
</a>`;
            }
        }

        return relationHTML;
    };

    function getPercent(voteCnt, totalCnt) {
        const percent = Math.round((voteCnt / totalCnt) * 100);
        return isNaN(percent) ? 0 : percent;
    }

    const makeItemHTML = (pollSeq, items, totalCnt) => {
        return items
            .map((item, i) => {
                i++;
                const percent = getPercent(item.voteCnt, totalCnt);
                return `<li class="answer02">
    <label for="survey_${pollSeq}_${i}">
        <span class="text_wrap">
            <span class="text_center">
                <span class="opt">
                    <input type="radio" id="survey_${pollSeq}_${i}" name="vote_${pollSeq}" value="${item.itemSeq}"/>
                    <strong>${percent}%</strong> | <em>${item.voteCnt}명</em>
                </span>
                <span class="bar">
                    <span class="bg">
                        <span class="fg" style="width: ${percent}%"></span>
                    </span>
                </span>
                <span class="txt">${item.title}</span>
            </span>            
        </span>
        <span class="vlign_fix"></span>        
    </label>
</li>`;
            })
            .join('');
    };

    const makePollHTML = (data) => {
        const startDate = commonUtil.isEmpty(data.startDt) ? '' : moment(data.startDt).format('YYYY-MM-DD');
        const endDate = commonUtil.isEmpty(data.endDt) ? '' : moment(data.endDt).format('MM-DD');
        return `
        <link rel="stylesheet" href="https://static.joins.com/joongang_15re/styles/pc/index.css?v=20210114">
        <div class="ab_poll2">
            <fieldset class="poll_ing_end">
                <legend class="hide">투표</legend>
                <div class="hd">
                    <span class="icon"></span>
                    <strong>${data.title}</strong>
                    <em>${startDate} - ${endDate} <span>${data.voteCnt}<span>명 참여</span></em>
                    ${makeRelationHTML(data.pollRelateContents)}
                </div>
                <div class="bd">
                    <ul class="answer_type0 config.layout clearfx">
                        ${makeItemHTML(data.pollSeq, data.pollItems, data.voteCnt)}
                    </ul>
                </div>
                <div class="ft"><button type="button" class="mg" style="cursor:pointer;">투표하기</button></div>
            </fieldset>
        </div>`;
    };

    const loadData = useCallback(
        (pollSeq) => {
            dispatch(
                getPreviewPoll({
                    pollSeq,
                    callback: (response) => {
                        if (response.header.success) {
                            setData(response.body);
                        } else {
                            toast.warning('관련투표 리스트를 조회하는데 실패하였습니다.');
                        }
                    },
                }),
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch],
    );

    useEffect(() => {
        if (!commonUtil.isEmpty(pollSeq)) {
            loadData(pollSeq);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pollSeq]);

    useEffect(() => {
        if (!commonUtil.isEmpty(data.pollSeq)) {
            setHtml(makePollHTML(data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <MokaModal show={show} onHide={onHide} width={600} size="lg">
            <MokaCardTabs
                height={600}
                className="shadow-none w-100"
                tabs={[
                    // 투표 미리보기 탭
                    <div className="px-card py-2 d-flex h-100">
                        {/*<iframe src="/test.html" style={{ height: '100%', border: 0 }}></iframe>*/}
                        <div dangerouslySetInnerHTML={{ __html: html }}></div>
                    </div>,
                    // 소스보기 탭
                    <div className="px-card py-2 d-flex h-100 w-100">
                        <MokaInput as="textarea" value={String(html).trim()} inputProps={{ readOnly: true, width: 400 }} />
                    </div>,
                ]}
                tabNavs={['투표 미리보기', '소스보기']}
                fill
            />
        </MokaModal>
    );
};

export default PollPreviewModal;
