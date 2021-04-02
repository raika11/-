/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.db.session.DpsSqlSessionFactory;
import jmnet.moka.core.dps.excepton.ApiException;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import jmnet.moka.web.dps.module.comment.Banned;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Description: 댓글모듈
 *
 * @author ssc
 * @since 2021-04-01
 */
@Slf4j
public class CommentModule implements ModuleInterface {

    @Autowired
    private DpsSqlSessionFactory sessionFactory;

    @Autowired
    private ActionLogger actionLogger;

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;

    public CommentModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {
        // 차단정보체크
        Banned banned = this.checkBanned(apiContext);
        Map<String, Object> map = new HashMap<>();
        map.put("BANNED", banned.isBanned());
        map.put("BANNED_TYPE", banned.getType());
        map.put("BANNED_VALUE", banned.getValue());
        if (banned.isBanned()) {
            return map;
        }

        // 등록
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        List<Map> result = this.call(apiContext, "dps.comment.insert", checkedParamMap);
        map.put("RESULT", result);
        return map;
    }

    private Banned checkBanned(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();

        // 차단IP체크
        if (checkedParamMap.containsKey("remoteIp") && checkedParamMap.get("remoteIp") != null) {
            String remoteIp = checkedParamMap
                    .get("remoteIp")
                    .toString();
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("type", "I");
            parameterMap.put("tag", remoteIp);
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.comment.bannedExist", parameterMap);
            if (parameterMap.containsKey("_EXIST")) {
                int exist = Integer.parseInt(parameterMap
                        .get("_EXIST")
                        .toString());
                if (exist > 0) {
                    return Banned
                            .builder()
                            .banned(true)
                            .type(Banned.BANNED_TAG_TYPE_IP)
                            .value(remoteIp)
                            .build();
                }
            }
        }

        // 차단User체크
        if (checkedParamMap.containsKey("member_memSeq") && checkedParamMap.get("member_memSeq") != null) {
            String member_memSeq = checkedParamMap
                    .get("member_memSeq")
                    .toString();
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("type", "U");
            parameterMap.put("tag", checkedParamMap
                    .get("member_memSeq")
                    .toString());
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.comment.bannedExist", parameterMap);
            if (parameterMap.containsKey("_EXIST")) {
                int exist = Integer.parseInt(parameterMap
                        .get("_EXIST")
                        .toString());
                if (exist > 0) {
                    return Banned
                            .builder()
                            .banned(true)
                            .type(Banned.BANNED_TAG_TYPE_USER)
                            .value(member_memSeq)
                            .build();
                }
            }
        }

        // 금지어체크
        if (checkedParamMap.containsKey("content") && checkedParamMap.get("content") != null) {
            String content = checkedParamMap
                    .get("content")
                    .toString();
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("_TOTAL", 0);
            ApiResult apiResult = ApiResult.createApiResult(this.call(apiContext, "dps.comment.bannedWord", parameterMap));
            List<Map<String, Object>> wordList = apiResult.getDataList(ApiResult.MAIN_DATA);
            for (Map<String, Object> map : wordList) {
                String tagValue = map
                        .get("TAG_VALUE")
                        .toString();
                if (content.indexOf(tagValue) != -1) {
                    return Banned
                            .builder()
                            .banned(true)
                            .type(Banned.BANNED_TAG_TYPE_WORD)
                            .value(tagValue)
                            .build();
                }
            }
        }

        return Banned
                .builder()
                .banned(false)
                .build();
    }

    private List<Map> call(ApiContext apiContext, String mapperId, Map<String, Object> parameterMap) {

        SqlSession sqlSession = null;
        List<Map> resultList = null;
        try {
            sqlSession = this.sessionFactory.getSqlSession(apiContext.getApiPath());
            resultList = sqlSession.selectList(mapperId, parameterMap);
            sqlSession.commit();
        } catch (Exception e) {
            if (sqlSession != null) {
                sqlSession.rollback();
            }

            log.error("request exception : {}", e.getMessage(), e);
            throw e;
        } finally {
            if (sqlSession != null) {
                sqlSession.close();
            }
        }

        return resultList;
    }


}
