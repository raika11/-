package jmnet.moka.web.rcv.task.jamxml.service;

import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultHeaderDTO;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.config.MokaRcvConfiguration;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleTotalVo;
import jmnet.moka.web.rcv.util.RcvUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.jamxml.service
 * ClassName : PurgeServiceImpl
 * Created : 2021-02-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-18 018 오전 11:48
 */
@Slf4j
@Service
public class PurgeServiceImpl implements PurgeService{
    final static String COMMAND_PURGE = "/command/purge";
    final static String DPS_PARAM_API_PATH = "apiPath";
    final static String DPS_PARAM_API_ID = "apiId";
    final static String DPS_PARAM_PREFIX = "prefix";
    final static String DPS_API_ID = "article";

    final static String COMMAND_ARTICLE_PURGE = "/command/articlePurge";
    final static String TMS_PARAM_ARTICLE_ID = "articleId";


    @Override
    public void purgeProcess(TaskInputData taskInputData, JamArticleTotalVo articleTotal, MokaRcvConfiguration rcvConfiguration) {
        try{
            final String articleId = Integer.toString(articleTotal.getTotalId() );
            dpsPurge( taskInputData, rcvConfiguration.getDpsTargets(), rcvConfiguration.getDefaultApiPath(), DPS_API_ID, articleId );
            tmsArticlePurge( taskInputData, rcvConfiguration.getTmsTargets(), articleId );
        }catch (Exception ignore) {
            taskInputData.logError("purge Exception !!");
        }
    }

    /**
     * DPS의 API를 purge한다.
     *
     *
     * @param taskInputData for 로그
     * @param apiPath api 경로
     * @param apiId   api ID
     * @param prefix  캐시키 접두사
     */
    @SuppressWarnings({"SameParameterValue"})
    private void dpsPurge(TaskInputData taskInputData, String[] dpsTargets, String apiPath, String apiId, String prefix){
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(COMMAND_PURGE);
        builder
                .queryParam(DPS_PARAM_API_PATH, apiPath)
                .queryParam(DPS_PARAM_API_ID, apiId);
        if (prefix != null) {
            builder.queryParam(DPS_PARAM_PREFIX, prefix);
        }
        String uriAndQuery = builder.build().encode().toString();

        String errorHost = null;
        for (String dpsHost : dpsTargets) {
            if ( RcvUtil.sendUrlGetRequest(dpsHost + uriAndQuery) == null ) {
                errorHost = dpsHost;
                break;
            }
        }

        if ( errorHost == null ) {
            log.info("DPS PURGE Success: [{}] [{}] [{}]", apiPath, apiId, prefix);
        } else {
            taskInputData.logError("DPS PURGE Error !! {}", errorHost );
        }
    }

    /**
     * 머징된 기사에 대한 기사 페이지를 purge한다.
     *
     * @param articleId 기사 id
     */
    public void tmsArticlePurge(TaskInputData taskInputData, String[] tmsTargets, String articleId) {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(COMMAND_ARTICLE_PURGE);
        builder.queryParam(TMS_PARAM_ARTICLE_ID, articleId);
        String uriAndQuery = builder
                .build()
                .encode()
                .toString();

        String errorHost = null;
        for (String tmsHost : tmsTargets) {
            if ( RcvUtil.sendUrlGetRequest(tmsHost + uriAndQuery) == null ) {
                errorHost = tmsHost;
                break;
            }
        }
        if (errorHost == null) {
            log.info("TMS PURGE Success: {}", articleId);
        } else {
            taskInputData.logError("TMS PURGE Error !! {}", errorHost );
        }
    }
}
