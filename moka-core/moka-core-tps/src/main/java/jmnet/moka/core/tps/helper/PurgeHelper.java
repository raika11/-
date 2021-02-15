/**
 * msp-tps PurgeHelper.java 2020. 7. 9. 오후 3:36:46 ssc
 */
package jmnet.moka.core.tps.helper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultHeaderDTO;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.TmsApiConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.purge.HttpPurger;
import jmnet.moka.core.common.purge.model.PagePurgeTask;
import jmnet.moka.core.common.purge.model.PurgeResult;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * <pre>
 *
 * 2020. 7. 9. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 7. 9. 오후 3:36:46
 */
public class PurgeHelper {

    public static final String DPS_PARAM_API_PATH = "apiPath";
    public static final String DPS_PARAM_API_ID = "apiId";
    public static final String DPS_PARAM_PREFIX = "prefix";
    public static final String TMS_PARAM_DOMAIN_ID = "domainId";
    public static final String TMS_PARAM_ITEM_TYPE = "itemType";
    public static final String TMS_PARAM_ITEM_ID = "itemId";
    public static final String TMS_PARAM_CATEGORY = "category";
    public static final String TMS_PARAM_HTML = "html";
    public static final String ITEM_DOMAIN_ID = "domainId";

    private static final Logger logger = LoggerFactory.getLogger(PurgeHelper.class);
    @Value("${tms.hosts}")
    private String[] tmsHosts;

    @Value("${tms.port}")
    private int tmsPort;

    @Value("${tms.command.targets}")
    private String[] tmsTargets;

    @Value("${dps.command.targets}")
    private String[] dpsTargets;

    @Autowired
    private RestTemplateHelper restTemplateHelper;
    @Autowired
    private MessageByLocale messageByLocale;
    @Autowired
    private PageService pageService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private MergeService mergeService;

    /**
     * tms퍼지. 모든 아이템에 해당. 한개 도메인 퍼지
     *
     * @param domainId 도메인아이디
     * @param itemType 아이템타입
     * @param seq      아이템순번
     * @return 실패시 실패메세지
     * @throws Exception
     */
    public String purgeTms(String domainId, String itemType, Long seq)
            throws Exception {

        List<String> domainIds = new ArrayList<String>(1);
        domainIds.add(domainId);
        return purgeTms(domainIds, itemType, seq);
    }

    public String purgeTmsDomain(HttpServletRequest request) {
        List<PurgeResult> resultList = new ArrayList<PurgeResult>();
        if (tmsHosts != null) {

            String urlString;
            try {
                urlString = "/command/domain?load=Y";
                int httpPort = tmsPort;
                HttpPurger httpPurger = new HttpPurger();
                for (String httpHost : tmsHosts) {
                    resultList.add(httpPurger.purge(httpHost, httpPort, urlString));
                }
            } catch (Exception e) {
                PurgeResult purgeResult = new PurgeResult("HTTP-ALL");
                purgeResult.setSuccess(false);
                purgeResult.setResponseCode(PurgeResult.PURGE_FAIL);
                purgeResult.setResponseMessage(e.getMessage());
                logger.error("Purge HTTP ALL Fail :{}", e, e);
            }

        }
        boolean success = true;
        String message = messageByLocale.get("tps.common.error.purge", request);
        for (PurgeResult result : resultList) {
            if (!result.isSuccess()) {
                success = false;
                message = String.format("%s\n%s", message, result.getName());
                logger.warn("Purge fail: {}", result.getResponseMessage());
            }
        }

        if (success) {
            logger.debug("Purge Domain Success!");
        }

        return success ? "" : message;
    }

    /**
     * tms퍼지. 모든 아이템에 해당. 여러개 도메인 퍼지
     *
     * @param domainIds 도메인아이디
     * @param itemType  아이템타입
     * @param seq       아이템순번
     * @return 실패시 실패메세지
     * @throws Exception
     */
    public String purgeTms(List<String> domainIds, String itemType, Long seq)
            throws Exception {

        PagePurgeTask task = new PagePurgeTask();
        for (String host : tmsHosts) {
            task.addHttpHost(host);
        }
        task.setHttpPort(tmsPort);
        for (String domainId : domainIds) {
            task.addPurgeItem(domainId, itemType, seq.toString());
        }
        List<PurgeResult> purgeResultList = task.purge();

        boolean success = true;
        String message = messageByLocale.get("tps.common.error.purge");
        for (PurgeResult result : purgeResultList) {
            if (!result.isSuccess()) {
                success = false;
                message = String.format("%s\n%s", message, result.getName());
                logger.warn("Purge fail: {}", result.getResponseMessage());
            }
        }

        if (success) {
            logger.info("Purge Item: [{}] [{}] [{}]", domainIds.toString(), itemType, seq);
        }

        return success ? "" : message;
    }



    /**
     * TMS의 TEMS 아이템을 purge 한다.
     *
     * @param itemList TEMS 아이템
     * @return 퍼지 결과
     */
    public String tmsPurge(List<MergeItem> itemList) {
        List<Map<String, String>> purgeItemList = new ArrayList<>();
        for (MergeItem mergeItem : itemList) {
            Map<String, String> itemMap = new HashMap<>();
            itemMap.put(TMS_PARAM_ITEM_TYPE, mergeItem.getItemType());
            itemMap.put(TMS_PARAM_ITEM_ID, mergeItem.getItemId());
            if (mergeItem
                    .getItemType()
                    .equals(MokaConstants.ITEM_DATASET)) {
                itemMap.put(TMS_PARAM_DOMAIN_ID, null);
            } else {
                itemMap.put(TMS_PARAM_DOMAIN_ID, mergeItem.getString(ITEM_DOMAIN_ID));
            }
            purgeItemList.add(itemMap);
        }

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        String params = "";
        try {
            params = ResourceMapper
                    .getDefaultObjectMapper()
                    .writeValueAsString(purgeItemList);
        } catch (IOException e) {
            logger.error("TMS PURGE ERROR: {}", e);
            return e.toString();
        }

        ResultHeaderDTO resultHeader = null;
        String errorHost = null;
        for (String tmsHost : tmsTargets) {
            try {
                ResponseEntity responseEntity = restTemplateHelper.post(tmsHost + TmsApiConstants.COMMAND_PURGE, params, headers);
                resultHeader = this.parseResultHeaderDTO(responseEntity);
            } catch (Exception e) {
                resultHeader = new ResultHeaderDTO(false, 500, 500, e.getMessage());
                logger.error("TMS PURGE Fail: {}", e);
            }
            if (!resultHeader.isSuccess()) {
                errorHost = tmsHost;
                break;
            }
        }
        if (resultHeader.isSuccess()) {
            logger.info("TMS PURGE Success: [{}] ", params);
            return "";
        } else {
            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        }
    }

    /**
     * 페이지 내용을 변경한다.
     *
     * @param pageList 페이지목록
     * @return
     * @throws NoDataException
     * @throws TemplateMergeException
     * @throws DataLoadException
     * @throws TemplateParseException
     */
    public String tmsPageUpdate(List<PageVO> pageList)
            throws NoDataException, TemplateMergeException, DataLoadException, TemplateParseException {
        String returnValue = "";
        for (PageVO page : pageList) {
            Page pageInfo = pageService
                    .findPageBySeq(page.getPageSeq())
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        return new NoDataException(message);
                    });
            PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);

            String html = mergeService.getMergePage(pageDto);
            String ret = this.tmsPageUpdate(pageDto
                    .getDomain()
                    .getDomainId(), page
                    .getPageSeq()
                    .toString(), page.getCategory(), html);
            returnValue = String.join("\r\n", ret);
        }
        return returnValue;
    }

    /**
     * 페이지 내용을 변경한다.
     *
     * @param domainId 도메인 Id
     * @param itemId   페이지 아이템 Id
     * @param category 카테고리
     * @param html     머징된 결과
     * @return 업데이트 결과
     */
    public String tmsPageUpdate(String domainId, String itemId, String category, String html) {
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<>();
        paramMap.add(TMS_PARAM_DOMAIN_ID, domainId);
        paramMap.add(TMS_PARAM_ITEM_ID, itemId);
        paramMap.add(TMS_PARAM_CATEGORY, category);
        paramMap.add(TMS_PARAM_HTML, html);

        ResultHeaderDTO resultHeader = null;
        String errorHost = null;
        for (String tmsHost : tmsTargets) {
            try {
                ResponseEntity responseEntity = restTemplateHelper.post(tmsHost + TmsApiConstants.COMMAND_PAGE_UPDATE, paramMap);
                resultHeader = this.parseResultHeaderDTO(responseEntity);
            } catch (Exception e) {
                resultHeader = new ResultHeaderDTO(false, 500, 500, e.getMessage());
                logger.error("TMS PAGE UPDATE Fail: {}", e);
            }
            if (!resultHeader.isSuccess()) {
                errorHost = tmsHost;
                break;
            }
        }
        if (resultHeader.isSuccess()) {
            logger.info("TMS PAGE UPDATE Success: [{}] [{}] [{}]", domainId, itemId, category);
            return "";
        } else {
            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        }
        //        if (resultHeader != null) {
        //            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        //        } else {
        //            logger.info("TMS PAGE UPDATE Success: [{}] [{}] [{}]", domainId, itemId, category);
        //            return "";
        //        }
    }

    /**
     * 예약어를 업데이트 한다.
     *
     * @param domainId 도메인 Id
     * @return 업데이트 결과
     */
    public String tmsReservedUpdate(String domainId) {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(TmsApiConstants.COMMAND_RESERVED_UPDATE);
        builder.queryParam(TMS_PARAM_DOMAIN_ID, domainId);
        String uriAndQuery = builder
                .build()
                .encode()
                .toString();

        ResultHeaderDTO resultHeader = null;
        String errorHost = null;
        for (String tmsHost : tmsTargets) {
            try {
                ResponseEntity responseEntity = restTemplateHelper.get(tmsHost + uriAndQuery);
                resultHeader = this.parseResultHeaderDTO(responseEntity);
            } catch (Exception e) {
                resultHeader = new ResultHeaderDTO(false, 500, 500, e.getMessage());
                logger.error("TMS RESERVED UPDATE Fail: {}", e);
            }
            if (!resultHeader.isSuccess()) {
                errorHost = tmsHost;
                break;
            }
        }
        if (resultHeader.isSuccess()) {
            logger.info("RESERVED UPDATE Fail: {}", domainId);
            return "";
        } else {
            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        }
    }

    /**
     * CDN으로 redirect할 기사 목록을 업데이트 한다.
     *
     * @param cdnArticleList CDN 목록
     * @return 업데이트 결과
     */
    public String tmsCdnUpdate(List<CdnArticle> cdnArticleList) {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        String params = "";
        try {
            params = ResourceMapper
                    .getDefaultObjectMapper()
                    .writeValueAsString(cdnArticleList);
        } catch (IOException e) {
            logger.error("TMS CDN UPDATE ERROR: {}", e);
            return e.toString();
        }

        ResultHeaderDTO resultHeader = null;
        String errorHost = null;
        for (String tmsHost : tmsTargets) {
            try {
                ResponseEntity responseEntity = restTemplateHelper.post(tmsHost + TmsApiConstants.COMMAND_CDN_UPDATE, params, headers);
                resultHeader = this.parseResultHeaderDTO(responseEntity);
            } catch (Exception e) {
                resultHeader = new ResultHeaderDTO(false, 500, 500, e.getMessage());
                logger.error("TMS CDN UPDATE Fail: {}", e);
            }
            if (!resultHeader.isSuccess()) {
                errorHost = tmsHost;
                break;
            }
        }
        if (resultHeader.isSuccess()) {
            logger.info("TMS CDN UPDATE Success: [{}] ", params);
            return "";
        } else {
            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        }
    }

    /**
     * DPS의 API를 purge한다.
     *
     * @param apiPath api 경로
     * @param apiId   api ID
     * @param prefix  캐시키 접두사
     * @return 퍼지 결과
     * @throws Exception 예외
     */
    public String dpsPurge(String apiPath, String apiId, String prefix)
            throws Exception {

        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(DpsApiConstants.COMMAND_PURGE);
        builder
                .queryParam(DPS_PARAM_API_PATH, apiPath)
                .queryParam(DPS_PARAM_API_ID, apiId);
        if (prefix != null) {
            builder.queryParam(DPS_PARAM_PREFIX, prefix);
        }
        String uriAndQuery = builder
                .build()
                .encode()
                .toString();

        ResultHeaderDTO resultHeader = null;
        String errorHost = null;
        for (String dpsHost : dpsTargets) {
            try {
                ResponseEntity responseEntity = restTemplateHelper.get(dpsHost + uriAndQuery);
                resultHeader = this.parseResultHeaderDTO(responseEntity);
            } catch (Exception e) {
                resultHeader = new ResultHeaderDTO(false, 500, 500, e.getMessage());
                logger.error("DPS PURGE Fail: {}", e);
            }
            if (!resultHeader.isSuccess()) {
                errorHost = dpsHost;
                break;
            }
        }
        if (resultHeader.isSuccess()) {
            logger.info("DPS PURGE Success: [{}] [{}] [{}]", apiPath, apiId, prefix);
            return "";
        } else {
            return String.format("%s\n%s:%s", messageByLocale.get("tps.common.error.purge"), errorHost, resultHeader.getMessage());
        }
    }


    private ResultHeaderDTO parseResultHeaderDTO(ResponseEntity responseEntity) {
        ResultDTO<Object> resultDTO = null;
        if (responseEntity.hasBody()) {
            String body = responseEntity
                    .getBody()
                    .toString();
            try {
                resultDTO = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(body, ResultDTO.class);
                return resultDTO.getHeader();
            } catch (Exception e) {
                return new ResultHeaderDTO(false, 500, 500, e.getMessage());
            }
        } else {
            return new ResultHeaderDTO(false, 500, 500, "결과를 알 수 없음");
        }
    }

}
