/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.mapper.MicMapper;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-27
 */
@Service
@Slf4j
public class MicAgendaCategoryServiceImpl implements MicAgendaCategoryService {

    @Autowired
    private MicMapper micMapper;

    @Override
    public List<MicAgendaCategoryVO> findAllMicAgendaCategory(MicAgendaCateSearchDTO search) {
        return micMapper.findAllUsedAgendaCategory(search);
    }

    @Override
    public boolean insertMicAgendaCategory(MicAgendaCategoryVO micAgendaCategoryVO) {
        Map<String, Object> param = new HashMap();
        Long retCode = (long) 0;
        param.put("catNm", micAgendaCategoryVO.getCatNm());
        param.put("retCode", retCode);
        micMapper.insertMicAgendaCategory(param);
        if ((int) param.get("retCode") == 0) {
            return false;
        }
        return true;
    }

    @Override
    public void updateMicAgendaCategory(List<MicAgendaCategoryVO> micAgendaCategoryVOList) {
        String categoryXml = "<ROOT>";
        if (micAgendaCategoryVOList != null & micAgendaCategoryVOList.size() > 0) {
            String itemXML = micAgendaCategoryVOList
                    .stream()
                    .map(c -> {
                        String xml = "<ITEM>";
                        xml += "<CAT_SEQ>" + c
                                .getCatSeq()
                                .toString() + "</CAT_SEQ>";
                        xml += "<CAT_NM>" + c.getCatNm() + "</CAT_NM>";
                        xml += "<USED_YN>" + c.getUsedYn() + "</USED_YN>";
                        xml += "<ORD_NO>" + c.getOrdNo() + "</ORD_NO>";
                        xml += "</ITEM>";

                        return xml;
                    })
                    .collect(Collectors.joining());
            categoryXml += itemXML;
        }
        categoryXml += "</ROOT>";
        micMapper.updateAllMicAgendaCategory(categoryXml);
    }
}
