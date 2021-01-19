/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.mapper.RcvArticleMapper;
import jmnet.moka.core.tps.mvc.rcvArticle.repository.RcvArticleBasicRepository;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-22
 */
@Slf4j
@Service
public class RcvArticleServiceImpl implements RcvArticleService {

    private final RcvArticleMapper rcvArticleMapper;

    private final RcvArticleBasicRepository rcvArticleBasicRepository;

    //    private final RcvArticleCodeRepository rcvArticleCodeRepository;

    private final ModelMapper modelMapper;

    public RcvArticleServiceImpl(RcvArticleMapper rcvArticleMapper, RcvArticleBasicRepository rcvArticleBasicRepository, ModelMapper modelMapper) {
        this.rcvArticleMapper = rcvArticleMapper;
        this.rcvArticleBasicRepository = rcvArticleBasicRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<RcvArticleBasicVO> findAllRcvArticleBasic(RcvArticleSearchDTO search) {
        return rcvArticleMapper.findAll(search);
    }

    @Override
    public Optional<RcvArticleBasic> findRcvArticleBasicById(Long rid) {
        return rcvArticleBasicRepository.findById(rid);
    }

    @Override
    public void findRcvArticleInfo(RcvArticleBasicDTO rcvArticleDto) {
        Map paramMap = new HashMap();
        paramMap.put("rid", rcvArticleDto.getRid());
        paramMap.put("sourceCode", rcvArticleDto
                .getArticleSource()
                .getSourceCode());
        List<List<Object>> listMap = rcvArticleMapper.findInfo(paramMap);
        if (listMap.size() == 3) {

            if (listMap.get(0) != null && listMap
                    .get(0)
                    .size() > 0) {
                List<String> categoryList = modelMapper.map(listMap.get(0), new TypeReference<List<String>>() {
                }.getType());
                rcvArticleDto.setCategoryList(categoryList);
            }

            if (listMap.get(1) != null && listMap
                    .get(1)
                    .size() > 0) {
                List<RcvArticleReporterVO> reporterList = modelMapper.map(listMap.get(1), RcvArticleReporterVO.TYPE);
                rcvArticleDto.setReporterList(reporterList);
            }

            if (listMap.get(2) != null && listMap
                    .get(2)
                    .size() > 0) {
                List<String> tagList = modelMapper.map(listMap.get(2), new TypeReference<List<String>>() {
                }.getType());
                rcvArticleDto.setTagList(tagList);
            }
        }
    }

    private boolean isReturnErr(Integer ret) {
        if (ret == null) {
            return true;
        }
        return ret == -800 || ret == -900;
    }

    @Override
    @Transactional
    public boolean insertRcvArticleIud(RcvArticleBasic rcvArticleBasic, RcvArticleBasicUpdateDTO updateDto) {

        Map paramMap = new HashMap();
        paramMap.put("rid", rcvArticleBasic.getRid());
        paramMap.put("sourceCode", rcvArticleBasic
                .getArticleSource()
                .getSourceCode());

        // 기자 삭제
        if (isReturnErr(rcvArticleMapper.callUspRcvArticleReporterDel(paramMap))) {
            return false;
        }

        // 분류코드 삭제
        if (isReturnErr(rcvArticleMapper.callUspRcvArticleCodeDel(paramMap))) {
            return false;
        }

        // 키워드 삭제
        if (isReturnErr(rcvArticleMapper.callUspRcvArticleKeywordDel(paramMap))) {
            return false;
        }

        // 기자 등록
        Map paramReporterMap = new HashMap();
        paramReporterMap.put("rid", rcvArticleBasic.getRid());
        paramReporterMap.put("sourceCode", rcvArticleBasic
                .getArticleSource()
                .getSourceCode());
        for (RcvArticleReporterVO reporter : updateDto.getReporterList()) {
            paramReporterMap.put("reporter", reporter);
            if (isReturnErr(rcvArticleMapper.callUspRcvArticleReporterIns(paramReporterMap))) {
                return false;
            }
        }

        // 분류코드 등록
        Map paramCatMap = new HashMap();
        paramCatMap.put("rid", rcvArticleBasic.getRid());
        paramCatMap.put("sourceCode", rcvArticleBasic
                .getArticleSource()
                .getSourceCode());
        int ord = 1;
        for (String category : updateDto.getCategoryList()) {
            paramCatMap.put("code", category);
            paramCatMap.put("ord", ord);
            if (isReturnErr(rcvArticleMapper.callUspRcvArticleCodeInsByMasterCode(paramCatMap))) {
                return false;
            }
            ord++;
        }

        // 키워드 등록
        Map paramTagMap = new HashMap();
        paramTagMap.put("rid", rcvArticleBasic.getRid());
        paramTagMap.put("sourceCode", rcvArticleBasic
                .getArticleSource()
                .getSourceCode());
        for (String tag : updateDto.getTagList()) {
            paramTagMap.put("keyword", tag);
            if (isReturnErr(rcvArticleMapper.callUspRcvArticleKeywordIns(paramTagMap))) {
                return false;
            }
        }

        // RCV_ARTICLE_IUD에 등록
        return insertRcvArticleIud(rcvArticleBasic);
    }

    @Override
    public boolean insertRcvArticleIud(RcvArticleBasic rcvArticleBasic) {
        Map paramMap = new HashMap();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("rid", rcvArticleBasic.getRid());
        paramMap.put("returnValue", returnValue);
        rcvArticleMapper.insertRcvArticleIud(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("INSERT FAIL RCV_ARTICLE_IUD rid: {} errorCode: {} ", rcvArticleBasic.getRid(), returnValue);
            return false;
        }
        return true;
    }

    //    @Override
    //    public List<String> findAllRcvArticleCode(Long rid, String sourceCode) {
    //        return rcvArticleCodeRepository.findByRid(rid, sourceCode);
    //    }
}
