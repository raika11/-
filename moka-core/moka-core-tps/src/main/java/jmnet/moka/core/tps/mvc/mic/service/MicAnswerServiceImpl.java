/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.code.AnswerDivCode;
import jmnet.moka.core.tps.mvc.mic.dto.MicAnswerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.mapper.MicMapper;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerRelVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicNotifyVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-28
 */
@Service
@Slf4j
public class MicAnswerServiceImpl implements MicAnswerService {

    @Autowired
    private MicMapper micMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MicAgendaService micAgendaService;

    @Value("${mic.answer.msg.div}")
    private String msgDiv;

    @Autowired
    protected MessageByLocale messageByLocale;

    @Override
    public List<MicAnswerVO> findAllMicAnswer(MicAnswerSearchDTO search) {
        return micMapper.findAllMicAnswer(search);
    }

    @Override
    public MicAnswerVO findMicAnswerById(Long answSeq) {
        MicAnswerVO micAnswerVO = null;
        List<List<Object>> listMap = micMapper.findMicAnswerById(answSeq);
        if (listMap.size() == 2) {
            if (listMap.get(0) != null && listMap
                    .get(0)
                    .size() > 0) {
                micAnswerVO = modelMapper.map(listMap
                        .get(0)
                        .get(0), MicAnswerVO.class);

                //현재는 하나만 사용
                if (listMap.get(1) != null && listMap
                        .get(1)
                        .size() > 0) {
                    MicAnswerRelVO micAnswerRelVO = modelMapper.map(listMap
                            .get(1)
                            .get(0), MicAnswerRelVO.class);
                    micAnswerVO.setAnswerRel(micAnswerRelVO);
                }
            }
        }
        return micAnswerVO;
    }

    @Override
    public boolean saveMicAnswerRel(MicAnswerRelVO micAnswerRelVO)
            throws IOException {
        micMapper.deleteAllMicAnswerRel(micAnswerRelVO.getAnswSeq());

        boolean uploaded = true;
        if (micAnswerRelVO.getArtThumbnailFile() != null) {
            String img = micAgendaService.saveImage(micAnswerRelVO.getArtThumbnailFile());
            if (McpString.isNotEmpty(img)) {
                micAnswerRelVO.setArtThumbnail(img);
            } else {
                uploaded = false;
            }
        }

        micMapper.insertMicAnswerRel(micAnswerRelVO);
        return uploaded;
    }

    @Override
    public void deleteMicAnswer(Long answSeq) {
        Map<String, Object> param = new HashMap<>();
        param.put("answSeq", answSeq);
        param.put("usedYn", MokaConstants.NO);
        micMapper.updateMicAnswerUsed(param);
    }

    @Override
    public void updateAnswerDiv(Long answSeq, String answDiv, HttpServletRequest request) {
        Map<String, Object> param = new HashMap<>();
        param.put("answDiv", answDiv);
        param.put("answSeq", answSeq);
        micMapper.updateMicAnswerDiv(param);

        // 관심
        if (answDiv.equals(AnswerDivCode.ATTENTION.getCode())) {
            MicNotifyVO micNotifyVO = MicNotifyVO
                    .builder()
                    .msgDiv(msgDiv)
                    .answSeq(answSeq)
                    .notiMemo(messageByLocale.get("tps.answer.attention.message", request))
                    .build();
        }
        // 기사화
        if (answDiv.equals(AnswerDivCode.PICK.getCode())) {
            MicNotifyVO micNotifyVO = MicNotifyVO
                    .builder()
                    .msgDiv(msgDiv)
                    .answSeq(answSeq)
                    .notiMemo(messageByLocale.get("tps.answer.pick.message", request))
                    .build();
        }

    }
}