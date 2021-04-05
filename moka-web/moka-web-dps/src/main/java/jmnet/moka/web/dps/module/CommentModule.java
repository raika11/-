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
        return null;
    }

    // 댓글등록
    public Object insert(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> returnMap = new HashMap<>();

        // totalId와 repSeq중 하나만 세팅되야 함.
        if (!this.checkId(apiContext)) {
            returnMap.put("SUCCESS", false);
            return returnMap;
        }

        // 차단정보체크.
        Banned banned = this.checkBanned(apiContext);
        if (banned.isBanned()) {
            returnMap.put("SUCCESS", !banned.isBanned());
            returnMap.put("CODE", banned.getType());
            returnMap.put("TARGET", banned.getValue());
            return returnMap;
        }

        // 기자체크
        if (!this.checkReporter(apiContext)) {
            returnMap.put("SUCCESS", false);
            returnMap.put("TARGET", "해당 기자가 존재하지 않습니다.");
            return returnMap;
        }

        // 기사체크
        if (!this.checkArticle(apiContext)) {
            returnMap.put("SUCCESS", false);
            returnMap.put("TARGET", "해당 기사가 존재하지 않습니다");
            return returnMap;
        }

        // 등록
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        List<Map> result = this.call(apiContext, "dps.comment.insert", checkedParamMap);
        returnMap.put("RESULT", result);
        return returnMap;
    }

    //기사조회. 기사가 없으면 false
    private boolean checkArticle(ApiContext apiContext) {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        Integer totalId = 0;
        if (checkedParamMap.containsKey("totalId") && checkedParamMap.get("totalId") != null) {
            totalId = Integer.parseInt(checkedParamMap
                    .get("totalId")
                    .toString());
        }

        String referrer = null;
        if (checkedParamMap.containsKey("referrer") && checkedParamMap.get("referrer") != null) {
            referrer = checkedParamMap
                    .get("referrer")
                    .toString();
        }

        if (totalId > 0 && !(referrer.contains("peoplemic.joins.com") || referrer.contains("joongang.joins.com/jpod"))) {
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("totalId", totalId);
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.article.isArticle", parameterMap);
            if (parameterMap.containsKey("_EXIST")) {
                int exist = Integer.parseInt(parameterMap
                        .get("_EXIST")
                        .toString());
                if (exist == 0) {
                    return false;
                }
            }
        }

        return true;
    }

    // totalId와 repSeq중 하나만 세팅되야 함. 둘다 세팅되어 있으면  false
    private boolean checkId(ApiContext apiContext) {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        Integer totalId = 0;
        if (checkedParamMap.containsKey("totalId") && checkedParamMap.get("totalId") != null) {
            totalId = Integer.parseInt(checkedParamMap
                    .get("totalId")
                    .toString());
        }
        Integer repSeq = 0;
        if (checkedParamMap.containsKey("repSeq") && checkedParamMap.get("repSeq") != null) {
            repSeq = Integer.parseInt(checkedParamMap
                    .get("repSeq")
                    .toString());
        }
        if (totalId > 0 && repSeq > 0) {
            return false;
        }
        return true;
    }

    // 댓글삭제
    public Object delete(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> returnMap = new HashMap<>();

        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        List<Map> result = this.call(apiContext, "dps.comment.delete", checkedParamMap);

        if (result.size() > 0) {
            int intVal = Integer.parseInt(result
                    .get(0)
                    .get("RESULT")
                    .toString());
            if (intVal == 0) {
                returnMap.put("SUCCESS", false);
            } else if (intVal == 1) {
                returnMap.put("SUCCESS", true);
            } else if (intVal == 2) {
                returnMap.put("SUCCESS", false);
                returnMap.put("CODE", "Unauthorized");
            }
        }
        return returnMap;
    }

    // 댓글 좋아요/싫어요/신고 등록
    public Object insertVote(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> returnMap = new HashMap<>();

        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        List<Map> result = this.call(apiContext, "dps.comment.insertVote", checkedParamMap);

        if (result.size() > 0) {
            int intVal = Integer.parseInt(result
                    .get(0)
                    .get("RESULT")
                    .toString());
            if (intVal == 0) {
                returnMap.put("SUCCESS", false);
            } else if (intVal == 1) {
                returnMap.put("SUCCESS", true);
            } else if (intVal == 2) {
                returnMap.put("SUCCESS", false);
                returnMap.put("CODE", "Duplicated");
            }
        }
        return returnMap;
    }

    // 차단정보조회. 차단정보면 Banned.success=false
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
            this.call(apiContext, "dps.comment.isBanned", parameterMap);
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
            this.call(apiContext, "dps.comment.isBanned", parameterMap);
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

    // 프로시저호출
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

    // 기자존재여부 조회. 존재하지 않으면 false
    private Boolean checkReporter(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();

        if (checkedParamMap.containsKey("repSeq") && checkedParamMap.get("repSeq") != null) {
            Integer repSeq = Integer.parseInt(checkedParamMap
                    .get("repSeq")
                    .toString());
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("repSeq", repSeq);
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.reporter.isReporter", parameterMap);
            if (parameterMap.containsKey("_EXIST")) {
                int exist = Integer.parseInt(parameterMap
                        .get("_EXIST")
                        .toString());
                if (exist == 0) {
                    return false;
                }
            }
        }
        return true;
    }


}
