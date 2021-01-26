/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaCateSearchDTO;
import jmnet.moka.core.tps.mvc.mic.dto.MicAgendaSearchDTO;
import jmnet.moka.core.tps.mvc.mic.mapper.MicMapper;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaCategoryVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAgendaVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicRelArticleVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-25
 */
@Service
@Slf4j
public class MicAgendaServiceImpl implements MicAgendaService {

    @Autowired
    private MicMapper micMapper;

    @Value("${agenda.image.save.filepath}")
    private String saveFilepath;

    @Autowired
    private FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    @Override
    public List<MicAgendaVO> findAllMicAgenda(MicAgendaSearchDTO search) {
        return micMapper.findAllMicAgenda(search);
    }

    @Override
    public boolean saveMicAgenda(MicAgendaVO micAgendaVO)
            throws IOException {
        boolean uploaded = true;

        //이미지업로드
        if (micAgendaVO.getAgndImgFile() != null) {
            String agndImg = saveImage(micAgendaVO.getAgndImgFile());
            if (McpString.isNotEmpty(agndImg)) {
                micAgendaVO.setAgndImg(agndImg);
            } else {
                uploaded = false;
            }
        }

        if (micAgendaVO.getAgndImgMobFile() != null) {
            String agndImgMob = saveImage(micAgendaVO.getAgndImgMobFile());
            if (McpString.isNotEmpty(agndImgMob)) {
                micAgendaVO.setAgndImgMob(agndImgMob);
            } else {
                uploaded = false;
            }
        }

        // 관련기사 이미지 업로드
        if (micAgendaVO.getRelArticleList() != null && micAgendaVO
                .getRelArticleList()
                .size() > 0) {
            for (MicRelArticleVO vo : micAgendaVO.getRelArticleList()) {
                if (vo.getArtThumbFile() != null) {
                    String artThumb = saveImage(vo.getArtThumbFile());
                    if (McpString.isNotEmpty(artThumb)) {
                        vo.setArtThumb(artThumb);
                    } else {
                        uploaded = false;
                    }
                }
            }
        }

        // 아젠다 등록
        Integer ok = micMapper.insertMicAgenda(micAgendaVO);

        if (micAgendaVO.getAgndSeq() != null && micAgendaVO.getAgndSeq() > 0) {

            // 관련기사 등록
            micMapper.deleteAllMicAgendaRelArticle(micAgendaVO.getAgndSeq());

            if (micAgendaVO.getRelArticleList() != null && micAgendaVO
                    .getRelArticleList()
                    .size() > 0) {
                for (MicRelArticleVO vo : micAgendaVO.getRelArticleList()) {
                    // 썸네일 바뀌었는지 확인할것
                    vo.setAgndSeq(micAgendaVO.getAgndSeq());
                    micMapper.insertMicAgendaRelArticle(vo);
                }
            }

            // 카테고리 등록
            String categoryXml = "<ROOT>";
            if (micAgendaVO.getCategoryList() != null & micAgendaVO
                    .getCategoryList()
                    .size() > 0) {
                String itemXML = micAgendaVO
                        .getCategoryList()
                        .stream()
                        .map(c -> "<ITEM><CAT_SEQ>" + c
                                .getCatSeq()
                                .toString() + "</CAT_SEQ></ITEM>")
                        .collect(Collectors.joining());
                categoryXml += itemXML;
            }
            categoryXml += "</ROOT>";

            Map<String, Object> param = new HashMap<>();
            param.put("agndSeq", micAgendaVO.getAgndSeq());
            param.put("xml", categoryXml);
            micMapper.updateMicAgendaCategory(param);
        }

        return uploaded;
    }

    private String saveImage(MultipartFile thumbnail)
            throws IOException {

        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String uuid = UUID
                .randomUUID()
                .toString();
        String fileName = uuid + "." + extension;

        // 경로
        // https://stg-pds.joongang.co.kr/news/postit/

        String remotePath = "/" + String.join("/", saveFilepath, McpDate.yearStr() + McpDate.monthStr(), McpDate.dayStr());

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.PDS, fileName, thumbnail.getInputStream(), remotePath);
        if (upload) {
            log.debug("SAVE AGENDA IMAGE");
            String path = pdsUrl + remotePath + "/" + fileName;
            return path;
        } else {
            log.debug("SAVE FAIL AGENDA IMAGE");
        }

        return "";
    }

    @Override
    public MicAgendaVO findMicAgendaById(Long agndSeq) {
        MicAgendaVO agenda = micMapper.findMicAgendaById(agndSeq);
        agenda.setCategoryList(micMapper.findMicAgendaCategoryById(agndSeq));
        agenda.setRelArticleList(micMapper.findMicAgendaRelArticleById(agndSeq));
        return agenda;
    }

    @Override
    public List<MicAgendaCategoryVO> findAllMicAgendaCategory(MicAgendaCateSearchDTO search) {
        return search
                .getUsedYn()
                .equals(MokaConstants.YES) ? micMapper.findAllUsedAgendaCategory() : null;
    }
}
