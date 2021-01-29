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
        <!--<link rel="stylesheet" href="https://static.joins.com/joongang_15re/styles/pc/index.css?v=20210114">-->
        <style>        
            .ab_poll2{clear:both;position:relative; width:100%}.ab_poll2 strong{font-weight:700}.ab_poll2 label{cursor:pointer}.ab_poll2 .hd{position:relative;margin-bottom:0}.ab_poll2 .hd .icon{float:left;width:15px;height:21px;margin-right:5px;background:url(https://images.joins.com/ui_joongang/news/pc/poll/ico_Q.png) 0 1px no-repeat;background-size:15px 21px}.ab_poll2 .hd strong{display:block;color:#2e2a26;font-size:15px;font-weight:700;line-height:23px;letter-spacing:-1.05px}.ab_poll2 .hd em{display:block;margin-top:8px;color:#8d8d8d;font-size:12px;letter-spacing:-.26px}.ab_poll2 .ft{clear:both;margin-top:25px;border-top:1px solid #e6e6e6;}.ab_poll2 .ft button{cursor:pointer;width:100px;height:40px;margin-top:20px;color:#fff!important;background-color:#2e2a26;font-size:12px!important;line-height:42px}.ab_poll2 .bd{clear:both;zoom:1}.ab_poll2 .bd:after,.ab_poll2 .ft:after{display:block;content:'';clear:both}.ab_poll2 .poll_end .bd li{padding-left:0}.ab_poll2 .poll_end .bd input{display:none}.ab_poll2 .poll_end .ft button{display:none}.ab_poll2 .answer_type02{padding-top:1px}.ab_poll2 .answer_type02 li{position:relative;margin-top:11px;padding-top:0;padding-left:30px}.ab_poll2 .answer_type02 li{zoom:1}.ab_poll2 .answer_type02 li:after{content:".";display:block;font-size:0;height:0;line-height:0;clear:both}.ab_poll2 .answer_type02 li label{display:block}.ab_poll2 .answer_type02 li .thumb{float:left;position:relative;width:60px;height:45px;margin:14px 10px 0 0}.ab_poll2 .answer_type02 li .thumb img{width:60px;height:45px}.ab_poll2 .answer_type02 li .thumb .mask{width:100%;height:100%;border:none;background:#fff;opacity:0;-ms-filter:alpha(opacity=0);filter:alpha(opacity=0)}.ab_poll2 .poll_end .answer_type02 li .text_wrap{height:69px}.ab_poll2 .answer_type02 li .opt{float:left;width:130px;color:#fff;font-size:12px;line-height:18px;letter-spacing:0}.ab_poll2 .answer_type02 li .opt input{position:absolute;left:0;width:15px;height:15px;margin:4px 0 0}.ab_poll2 .answer_type02 li .opt strong{display:inline-block;*display:inline;zoom:1;color:#777;font-size:18px;line-height:27px;letter-spacing:0;vertical-align:middle}.ab_poll2 .answer_type02 li.answer01 .opt strong{color:#ff3c14}.ab_poll2 .answer_type02 li.answer02 .opt strong{color:#09c1ac}.ab_poll2 .answer_type02 li .opt em{position:absolute;right:0;top:2px;color:#2e2a26;font-size:12px;line-height:21px;letter-spacing:-.24px;text-align:right;vertical-align:middle}.ab_poll2 .answer_type02 li .bar{float:left;position:relative;width:100%;height:10px;margin-top:6px}.ab_poll2 .answer_type02 li .bar .bg{display:block;position:absolute;top:0;left:0;width:100%;height:10px;background:#f4f4f4}.ab_poll2 .answer_type02 li .bar .fg{display:block;position:absolute;top:0;left:0;width:100%;height:10px;background:#777}.ab_poll2 .answer_type02 li.answer01 .bar .fg{background:#ff3c14}.ab_poll2 .answer_type02 li.answer02 .bar .fg{background:#09c1ac}.ab_poll2 .answer_type02 li .txt{clear:both;display:block;padding-top:6px;color:#2e2a26;font-size:13px;letter-spacing:-.02em;overflow:hidden;font-weight:400}.ab_poll2 .poll_ing .opt strong,.ab_poll2 .poll_ing .opt em,.ab_poll2 .poll_ing .bar{display:none!important}.ab_poll2 .poll_ing .txt{position:absolute;left:23px;top:-3px;background:#fff}.ab_poll2 .poll_end .answer_type02 li.answer01 .txt{font-weight:700}.ab_poll2 .ft span{display:inline-block;position:relative;margin-top:20px;padding-left:26px;color:#777;font-size:13px;line-height:20px}.ab_poll2 .ft span:before{display:block;content:'';position:absolute;left:0;top:0;width:20px;height:20px;background:url(https://images.joins.com/ui_joongang/news/pc/poll/ico_done.png) 0 0 no-repeat;background-size:100% auto}.ab_poll2 .poll_end .answer_type02 li label{cursor:default}
            .ab_poll2 ul{ list-style: none; margin: 0;padding: 0;border: 0;outline: 0;font-size: 100%;vertical-align: baseline;background: transparent;}
            .ab_poll2 button { margin: 0;padding: 0;border: 0;outline: 0;font-size: 100%;vertical-align: baseline;}
            .ab_poll2 .hide{ display:none }
            .ab_poll2 .hd em{font-size:13px;margin-top:10px;}.ab_poll2 .hd em span span{font-size:12px;}.ab_poll2 .article{display:block;margin-top:2px;color:#4984c3;font-size:12px;}.ab_poll2 .article span{position:relative;padding-right:8px;}.ab_poll2 .article span:after{content:'';display:block;position:absolute;right:0;top:2px;width:4px;height:12px;background:url('https://images.joins.com/ui_joongang/news/pc/index/ico_arrow.png') 0 2px no-repeat;background-size:100% auto;}.ab_poll2 .poll_end .ft{margin-top:20px;text-align:center;}.ab_poll2 .poll_ing .ft{border-top:none;}.ab_poll2 .poll_ing .ft button{margin-top:0;}.ab_poll2 .ft button{background:#efefef;color:#000 !important;}
            .ab_poll2 .ft button.active{background:#2e2a26;color:#fff !important;}.ab_poll_wrap{margin-top:0;margin-bottom:50px;}.ab_poll_wrap.section_column .title_wrap{margin-bottom:9px;margin-top:-6px;}
        </style>
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
                    <ul class="answer_type01 clearfx">
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
                        <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: html }}></div>
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
