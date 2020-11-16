/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.relation.controller;

import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 관련아이템 API
 *
 * @author ssc
 * @since 2020-10-29
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/relations")
public class RelationRestController {

    @Autowired
    private RelationService relationService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 관련 아이템 목록조회
     *
     * @param search 검색조건
     * @return 관련아이템 목록
     * @throws Exception 예외
     */
    @ApiOperation(value = "관련 아이템 목록조회(부모찾기)")
    @GetMapping
    public ResponseEntity<?> getRelationList(@Valid @SearchParam RelationSearchDTO search)
            throws Exception {

        String relType = search.getRelType();

        try {
            if (relType.equals(MokaConstants.ITEM_PAGE)) {

                // 페이지 목록 조회
                search.setEntityClass(PageVO.class);
                search.setDefaultSort("pageSeq,desc");

                // 조회(mybatis)
                List<PageVO> returnValue = relationService.findAllPage(search);

                ResultListDTO<PageVO> resultList = new ResultListDTO<PageVO>();
                resultList.setList(returnValue);
                resultList.setTotalCnt(search.getTotal());

                ResultDTO<ResultListDTO<PageVO>> resultDTO = new ResultDTO<ResultListDTO<PageVO>>(resultList);
                tpsLogger.success(ActionType.SELECT, true);
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);

            } else if (relType.equals(MokaConstants.ITEM_ARTICLE_PAGE)) {
                // 콘텐츠 스킨 목록 조회
                search.setEntityClass(ArticlePageVO.class);
                search.setDefaultSort("artPageSeq,desc");

                // 조회(mybatis)
                List<ArticlePageVO> returnValue = relationService.findAllArticlePage(search);

                ResultListDTO<ArticlePageVO> resultList = new ResultListDTO<ArticlePageVO>();
                resultList.setList(returnValue);
                resultList.setTotalCnt(search.getTotal());

                ResultDTO<ResultListDTO<ArticlePageVO>> resultDTO = new ResultDTO<ResultListDTO<ArticlePageVO>>(resultList);
                tpsLogger.success(ActionType.SELECT, true);
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);

            } else if (relType.equals(MokaConstants.ITEM_CONTAINER)) {

                // 컨테이너 목록 조회
                search.setDefaultSort("containerSeq,desc");
                Pageable pageable = search.getPageable();

                Page<Container> containers = relationService.findAllContainer(search, pageable);
                ResultListDTO<ContainerDTO> resultListMessage = new ResultListDTO<ContainerDTO>();

                List<ContainerDTO> dtoList = modelMapper.map(containers.getContent(), ContainerDTO.TYPE);
                resultListMessage.setTotalCnt(containers.getTotalElements());
                resultListMessage.setList(dtoList);

                ResultDTO<ResultListDTO<ContainerDTO>> resultDto = new ResultDTO<ResultListDTO<ContainerDTO>>(resultListMessage);
                tpsLogger.success(ActionType.SELECT, true);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);

            } else if (relType.equals(MokaConstants.ITEM_COMPONENT)) {

                // 컴포넌트 목록 조회
                //                search.setEntityClass(ComponentVO.class);
                //                search.setDefaultSort("componentSeq,desc");
                //
                //                List<ComponentVO> returnValue = relationService.findAllComponent(search);
                //
                //                ResultListDTO<ComponentVO> resultList = new ResultListDTO<ComponentVO>();
                //                resultList.setList(returnValue);
                //                resultList.setTotalCnt(search.getTotal());
                //
                //                ResultDTO<ResultListDTO<ComponentVO>> resultDTO = new ResultDTO<ResultListDTO<ComponentVO>>(resultList);
                //                tpsLogger.success(ActionType.SELECT, true);
                //                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
                search.setDefaultSort("componentSeq,desc");
                Pageable pageable = search.getPageable();

                Page<Component> components = relationService.findAllComponent(search, pageable);
                ResultListDTO<ComponentDTO> resultListMessage = new ResultListDTO<ComponentDTO>();

                List<ComponentDTO> dtoList = modelMapper.map(components.getContent(), ComponentDTO.TYPE);
                resultListMessage.setTotalCnt(components.getTotalElements());
                resultListMessage.setList(dtoList);

                ResultDTO<ResultListDTO<ComponentDTO>> resultDto = new ResultDTO<ResultListDTO<ComponentDTO>>(resultListMessage);
                tpsLogger.success(ActionType.SELECT, true);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            }

            return new ResponseEntity<>(new ResultDTO<Boolean>(false), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[RELATION SELECT FAILED] seq: {} {} {}", search.getRelSeqType(), search.getRelSeq(), e.getMessage());
            tpsLogger.error(ActionType.SELECT, "[RELATION SELECT FAILED]", e, true);
            throw new Exception(messageByLocale.get("tps.common.error.has-relation"), e);
        }
    }

}
