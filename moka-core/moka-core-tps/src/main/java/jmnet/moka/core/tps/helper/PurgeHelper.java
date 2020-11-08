/**
 * msp-tps PurgeHelper.java 2020. 7. 9. 오후 3:36:46 ssc
 */
package jmnet.moka.core.tps.helper;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.purge.HttpPurger;
import jmnet.moka.core.common.purge.model.PagePurgeTask;
import jmnet.moka.core.common.purge.model.PurgeResult;
import jmnet.moka.core.tps.mvc.page.entity.Page;

/**
 * <pre>
 * 
 * 2020. 7. 9. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 7. 9. 오후 3:36:46
 * @author ssc
 */
public class PurgeHelper {

    private static final Logger logger = LoggerFactory.getLogger(PurgeHelper.class);

    @Value("${tms.hosts}")
    private String[] tmsHosts;

    @Value("${tms.port}")
    private int tmsPort;

    @Value("${varnish.hosts}")
    private String[] varnishHosts;

    @Value("${varnish.port}")
    private int varnishPort;

    @Value("${deploy.mode}")
    private String deployMode;

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * tms퍼지. 모든 아이템에 해당. 한개 도메인 퍼지
     *
     * @param domainId 도메인아이디
     * @param itemType 아이템타입
     * @param seq 아이템순번
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

        if (success)
            logger.debug("Purge Domain Success!");

        return success ? "" : message;
    }

    /**
     * tms퍼지. 모든 아이템에 해당. 여러개 도메인 퍼지
     *
     * @param domainIds 도메인아이디
     * @param itemType 아이템타입
     * @param seq 아이템순번
     * @return 실패시 실패메세지
     * @throws Exception
     */
    public String purgeTms(List<String> domainIds, String itemType,
            Long seq) throws Exception {

        if (McpString.isEmpty(deployMode) || !deployMode.equals("periodic")) {
            logger.info("Purge Fail. [deploy.mode] is not set.");
            return "";
        }

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

        if (success)
            logger.info("Purge Item: [{}] [{}] [{}]", domainIds.toString(), itemType, seq);

        return success ? "" : message;
    }


    /**
     * 바니쉬 퍼지. 페이지만 해당함.
     *
     * @param page 페이지엔티티
     * @return 실패시 실패메세지
     * @throws Exception
     */
    public String purgeVarnish(Page page) throws Exception {

        PagePurgeTask task = new PagePurgeTask();
        for (String host : varnishHosts) {
            task.addVarnishHost(host);
        }
        task.setVarnishPort(varnishPort);
        task.addPurgeItem(page.getDomain().getDomainId(), "PG", page.getPageSeq().toString());

        String url = String.format("%s.*", page.getPageUrl());
        task.addPurgeUrl(page.getDomain().getDomainUrl(), url, true);
        List<PurgeResult> purgeResultList = task.purge();

        boolean success = true;
        String message = messageByLocale.get("tps.common.error.purge");
        for (PurgeResult result : purgeResultList) {
            if (!result.isSuccess()) {
                success = false;
                message = String.format("%s\n%s", message, result.getName());
                logger.warn("Varnish Purge fail: {}", result.getResponseMessage());
            }
        }

        if (success)
            logger.info("Varnish Purge: [{}]", url);

        return success ? "" : message;
    }
}
