/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.RequestHandler;
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
    private static final List<Object> EMPTY_LIST = new ArrayList<>();

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

    /**
     * 댓글등록
     *
     * @param apiContext
     * @return 댓글등록결과 _DATA안에 들어감.
     * @throws ApiException
     */
    public Object insert(ApiContext apiContext)
            throws ApiException {
        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);
        try {
            apiResult.put(RequestHandler.PARAM_MAP, checkedParamMap);

            // 차단정보체크.
            Banned banned = this.checkBanned(apiContext);
            if (banned.isBanned()) {
                checkedParamMap.put("_SUCCESS", !banned.isBanned());
                checkedParamMap.put("_CODE", banned.getType());
                checkedParamMap.put("_MESSAGE", banned.getValue());
                return apiResult;
            }

            // id의 정보체크
            if (!this.checkId(apiContext)) {
                checkedParamMap.put("_SUCCESS", false);
                checkedParamMap.put("_MESSAGE", "해당 정보가 존재하지 않습니다.");
                return apiResult;
            }

            // 등록
            List<Map> result = this.call(apiContext, "dps.comment.insert", checkedParamMap);

            checkedParamMap.put("_SUCCESS", true);
            apiResult.put(ApiResult.MAIN_DATA, result);
            return apiResult;

        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            checkedParamMap.put("_SUCCESS", false);
            checkedParamMap.put("_MESSAGE", e.getMessage());
            return apiResult;
        }
    }


    /**
     * 댓글삭제
     *
     * @param apiContext
     * @return
     * @throws ApiException
     */
    public Object delete(ApiContext apiContext)
            throws ApiException {
        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);
        try {
            apiResult.put(RequestHandler.PARAM_MAP, checkedParamMap);

            List<Map> result = this.call(apiContext, "dps.comment.delete", checkedParamMap);

            checkedParamMap.put("_SUCCESS", false);
            if (result.size() > 0) {
                int intVal = Integer.parseInt(result
                        .get(0)
                        .get("RESULT")
                        .toString());
                if (intVal == 0) {
                    checkedParamMap.put("_SUCCESS", false);
                } else if (intVal == 1) {
                    checkedParamMap.put("_SUCCESS", true);
                    //                    apiResult.put(ApiResult.MAIN_DATA, result);
                } else if (intVal == 2) {
                    checkedParamMap.put("_SUCCESS", false);
                    apiResult.put("_MESSAGE", "Unauthorized");
                }
            }
            return apiResult;
        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            checkedParamMap.put("_SUCCESS", false);
            checkedParamMap.put("_MESSAGE", e.getMessage());
            return apiResult;
        }
    }

    /**
     * 댓글 좋아요/싫어요/신고 등록
     *
     * @param apiContext
     * @return
     * @throws ApiException
     */
    public Object insertVote(ApiContext apiContext)
            throws ApiException {
        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);
        try {
            apiResult.put(RequestHandler.PARAM_MAP, checkedParamMap);

            if (!checkedParamMap.containsKey("member_memSeq")) {
                checkedParamMap.put("member_memSeq", null);
                checkedParamMap.put("member_loginType", null);
                checkedParamMap.put("member_nick", null);
            }
            List<Map> result = this.call(apiContext, "dps.comment.insertVote", checkedParamMap);

            if (result.size() > 0) {
                int intVal = Integer.parseInt(result
                        .get(0)
                        .get("RESULT")
                        .toString());
                if (intVal == 0) {
                    checkedParamMap.put("_SUCCESS", false);
                } else if (intVal == 1) {
                    checkedParamMap.put("_SUCCESS", true);
                } else if (intVal == 2) {
                    checkedParamMap.put("_SUCCESS", false);
                    checkedParamMap.put("_MESSAGE", "Duplicated");
                }
            }
            return apiResult;
        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            checkedParamMap.put("_SUCCESS", false);
            checkedParamMap.put("_MESSAGE", e.getMessage());
            return apiResult;
        }
    }

    /**
     * id의 정보체크
     *
     * @param apiContext
     * @return
     * @throws ApiException
     */
    private boolean checkId(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        if (checkedParamMap.containsKey("type") && checkedParamMap.get("type") != null) {
            String contentType = checkedParamMap
                    .get("type")
                    .toString();

            if (contentType.equals("A")) {
                return this.checkArticle(apiContext);
            }
            if (contentType.equals("R")) {
                return this.checkReporter(apiContext);
            }
            if (contentType.equals("J")) {
                return this.checkEpisode(apiContext);
            }
            if (contentType.equals("D")) {
                return this.checkDigital(apiContext);
            }
        }
        return true;
    }

    /**
     * 기사조회
     *
     * @param apiContext
     * @return 기사가 없으면 false
     */
    private boolean checkArticle(ApiContext apiContext) {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        Integer totalId = 0;
        if (checkedParamMap.containsKey("id") && checkedParamMap.get("id") != null) {
            totalId = Integer.parseInt(checkedParamMap
                    .get("id")
                    .toString());
        }

        String domain = null;
        if (checkedParamMap.containsKey("domain") && checkedParamMap.get("domain") != null) {
            domain = checkedParamMap
                    .get("domain")
                    .toString();
        }

        String section = null;
        if (checkedParamMap.containsKey("section") && checkedParamMap.get("section") != null) {
            section = checkedParamMap
                    .get("section")
                    .toString();
        }

        if (totalId > 0 && domain.contains("joongang.joins.com") && section.contains("/article")) {
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

    /**
     * 기자존재여부 조회
     *
     * @param apiContext
     * @return 존재하지 않으면 false
     * @throws ApiException
     */
    private Boolean checkReporter(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        Integer repSeq = 0;
        if (checkedParamMap.containsKey("id") && checkedParamMap.get("id") != null) {
            repSeq = Integer.parseInt(checkedParamMap
                    .get("id")
                    .toString());
        }

        if (repSeq > 0) {
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

    /**
     * 에피소드존재여부 조회
     *
     * @param apiContext
     * @return 존재하지 않으면 false
     * @throws ApiException
     */
    private Boolean checkEpisode(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();

        Integer epsdSeq = 0;
        if (checkedParamMap.containsKey("id") && checkedParamMap.get("id") != null) {
            epsdSeq = Integer.parseInt(checkedParamMap
                    .get("id")
                    .toString());
        }

        if (epsdSeq > 0) {
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("epsdSeq", epsdSeq);
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.jpod.isEpisode", parameterMap);
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

    /**
     * 디지털스페셜 존재여부 조회
     *
     * @param apiContext
     * @return 존재하지 않으면 false
     * @throws ApiException
     */
    private Boolean checkDigital(ApiContext apiContext)
            throws ApiException {
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();

        Integer did = 0;
        if (checkedParamMap.containsKey("id") && checkedParamMap.get("id") != null) {
            did = Integer.parseInt(checkedParamMap
                    .get("id")
                    .toString());
        }

        if (did > 0) {
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("id", did);
            parameterMap.put("_EXIST", 0);
            this.call(apiContext, "dps.article.isDigitalSpecial", parameterMap);
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

    /**
     * 차단정보조회
     *
     * @param apiContext
     * @return 차단정보면 Banned.success=false
     * @throws ApiException
     */
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

    /**
     * 프로시저호출
     *
     * @param apiContext
     * @param mapperId
     * @param parameterMap
     * @return
     */
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

            log.error("module sql exception : {}", e.getMessage(), e);
            throw e;
        } finally {
            if (sqlSession != null) {
                sqlSession.close();
            }
        }

        return resultList;
    }

}
