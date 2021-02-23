package jmnet.moka.web.push.scheduler;

import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.web.push.mvc.sender.dto.PushContentUsedYnSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentsDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentsProcDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushRelContentIdSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;
import jmnet.moka.web.push.mvc.sender.service.PushContentsService;
import jmnet.moka.web.push.support.scheduler.AbstractScheduler;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <pre>
 * 일정 시간에 컨텐츠를 푸시 요청하는 스케줄러 예제
 * Project : moka
 * Package : jmnet.moka.web.push.scheduler
 * ClassName : ExampleScheduler
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Component
public class ExampleScheduler extends AbstractScheduler {

    @Autowired
    protected ModelMapper modelMapper;

    private final PushContentsService pushContentsService;

    public ExampleScheduler(PushContentsService pushContentsService) {
        this.pushContentsService = pushContentsService;
    }

    @Override
    public void invoke() throws Exception {

        log.debug("설정 시간에 활성화되어 푸시 컨텐츠 조회 후 컨텐츠가 있을 경우 메세지를 전송하는 스케줄러");

        // todo 1. 푸시 대상 컨텐츠 조회

        PushContentUsedYnSearchDTO searchUsedYn = new PushContentUsedYnSearchDTO();
        searchUsedYn.setUsedYn("Y");

        Page<PushContents> returnValue = pushContentsService.findAllByUsedYn(searchUsedYn);

        List<PushContentsDTO> dtoList = modelMapper.map(returnValue.getContent(), PushContentsDTO.TYPE);

        PushContentsDTO contentsItem = new PushContentsDTO();

        //for(int i=0; i < dtoList.size(); i++) {
        for(PushContentsDTO pushContentsDTO : dtoList){
            contentsItem.setContentSeq(pushContentsDTO.getContentSeq().longValue());
            contentsItem.setUsedYn(pushContentsDTO.getUsedYn());
            contentsItem.setPushYn(pushContentsDTO.getPushYn());
            contentsItem.setPushType(pushContentsDTO.getPushType());
            contentsItem.setIconType(pushContentsDTO.getIconType());
            contentsItem.setPicYn(pushContentsDTO.getPicYn());
            contentsItem.setSendEmail(pushContentsDTO.getSendEmail());
            contentsItem.setRsvDt(pushContentsDTO.getRsvDt());
            contentsItem.setRepId(pushContentsDTO.getRepId());
            contentsItem.setRegDt(pushContentsDTO.getRegDt());
            contentsItem.setRegId(pushContentsDTO.getRegId());
            contentsItem.setModDt(pushContentsDTO.getModDt());
            contentsItem.setModId(pushContentsDTO.getModId());
            contentsItem.setRelContentId(pushContentsDTO.getRelContentId());
            contentsItem.setRelUrl(pushContentsDTO.getRelUrl());
            contentsItem.setImgUrl(pushContentsDTO.getImgUrl());
            contentsItem.setPushImgUrl(pushContentsDTO.getPushImgUrl());
            contentsItem.setTitle(pushContentsDTO.getTitle());
            contentsItem.setSubTitle(pushContentsDTO.getSubTitle());
            contentsItem.setContent(pushContentsDTO.getContent());
        }

        try {
            // todo 2. TB_PUSH_CONTENTS에 푸시 정보 등록
            PushContents pushContents = modelMapper.map(contentsItem, PushContents.class);
            PushContents returnValue2 = pushContentsService.savePushContents(pushContents);
            log.debug("[SUCCESS TO INSERT PUSH CONTENTS]");
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PUSH CONTENTS]", e);
            throw new Exception("푸시 기사 등록이 되지 않습니다.", e);
        }

        /**
         * todo 3. TB_PUSH_CONTENTS_PROC에 앱별 푸시 상태 정보 등록
         * - status_flag = '0'
         **/
        try {
            PushContentsProcDTO contentsProcItem = new PushContentsProcDTO();

            PushContentsProc pushContentsProc = modelMapper.map(contentsProcItem, PushContentsProc.class);

            Integer cnt = 0;
            Integer appSeq = 0;  //확인 필요 컬럼

            for(int i=0; i < dtoList.size(); i++) {

                PushContentsProcPK pushContentsProcPK = PushContentsProcPK
                        .builder()
                        .contentSeq(dtoList.get(i).getContentSeq().longValue())
                        .appSeq(appSeq.intValue())
                        .build();
                pushContentsProc.setId(pushContentsProcPK);

                pushContentsProc.setStatusFlag("0");
                pushContentsProc.setTargetCnt(cnt.longValue());
                pushContentsProc.setSendCnt(cnt.longValue());
                pushContentsProc.setRcvCnt(cnt.longValue());
                pushContentsProc.setOpenCnt(cnt.longValue());
                pushContentsProc.setLastTokenSeq(cnt.longValue());
            }

            PushContentsProc returnProcValue = pushContentsService.savePushContentsProc(pushContentsProc);
            log.debug("[SUCCESS TO INSERT PUSH CONTENTSPROC]");
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PUSH CONTENTSPROC]", e);
            throw new Exception("푸시 기사 이력 등록이 되지 않습니다.", e);
        }

        /**
         * 푸시 작업 등록
         */
        for(int i=0; i < dtoList.size(); i++) {
            PushContents pushItem = PushContents
                    .builder()
                    .pushType(dtoList.get(i).getPushType())
                    .contentSeq(dtoList.get(i).getContentSeq().longValue())
                    .build();
            boolean success = pushSenderHandler.addPushJob(pushItem);
        }
    }
}
