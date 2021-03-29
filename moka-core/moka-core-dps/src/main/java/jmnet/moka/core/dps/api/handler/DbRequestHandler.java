package jmnet.moka.core.dps.api.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.DbRequest;
import jmnet.moka.core.dps.db.session.DpsSqlSessionFactory;
import org.apache.commons.jexl3.JexlScript;
import org.apache.commons.jexl3.MapContext;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class DbRequestHandler implements RequestHandler {
    public final static Logger logger = LoggerFactory.getLogger(DbRequestHandler.class);
    public final static String PARAM_MAP = "PARAM_MAP";
    @Autowired
    private DpsSqlSessionFactory sessionFactory;

    private HashMap<String, JexlScript> scriptMap = new HashMap<String, JexlScript>(256);

    @Override
    public ApiResult processRequest(ApiContext apiContext) {
        DbRequest dbRequest = (DbRequest) apiContext.getCurrentRequest();
        long startTime = System.currentTimeMillis();

        String mapperId = getMapperId(dbRequest, apiContext);

        List<Map<String, Object>> result = null;
        if (dbRequest
                .getDmlType()
                .equals(DbRequest.DML_TYPE_SELECT)) {
            result = select(apiContext.getSqlSession(), mapperId, apiContext.getCheckedParamMap());
        } else if (dbRequest
                .getDmlType()
                .equals(DbRequest.DML_TYPE_PROCEDURE)) {
            return processProcedure(apiContext, dbRequest, mapperId, startTime);
        } else if (dbRequest
                .getDmlType()
                .equals(DbRequest.DML_TYPE_INSERT)) {
            result = insert(apiContext.getSqlSession(), mapperId, apiContext.getCheckedParamMap());
        } else if (dbRequest
                .getDmlType()
                .equals(DbRequest.DML_TYPE_UPDATE)) {
            result = update(apiContext.getSqlSession(), mapperId, apiContext.getCheckedParamMap());
        } else if (dbRequest
                .getDmlType()
                .equals(DbRequest.DML_TYPE_DELETE)) {
            result = delete(apiContext.getSqlSession(), mapperId, apiContext.getCheckedParamMap());
        }
        long endTime = System.currentTimeMillis();
        return ApiResult.createApiResult(startTime, endTime, result, true, null);
    }

    private ApiResult processProcedure(ApiContext apiContext, DbRequest dbRequest, String mapperId, long startTime) {
        try {
            Map<String, Object> parameterMap = apiContext.getCheckedParamMap();
            ApiResult apiResult = null;
            List<Object> resultList = call(apiContext.getSqlSession(), mapperId, parameterMap);
            long endTime = System.currentTimeMillis();
            String setNames = dbRequest.getSetNames();
            if (McpString.isNotEmpty(setNames)) {
                String[] setNamesArray = setNames.split(",");
                if ( setNamesArray.length == 1) { // set이 하나일 경우 전체가 결과임
                    apiResult = ApiResult.createApiResult(startTime, endTime, resultList, true, null);
                } else {
                    for (int i = 0; i < setNamesArray.length; i++) {
                        if (apiResult == null) {
                            if (resultList.size() > 0) {
                                apiResult = ApiResult.createApiResult(startTime, endTime, resultList.get(i), true, null);
                            } else {
                                apiResult = ApiResult.createApiResult(startTime, endTime, new ArrayList<>(), true, null);
                            }
                        } else {
                            if (resultList.size() > 0) {
                                apiResult.addApiResult(setNamesArray[i], ApiResult.createApiResult(startTime, endTime, resultList.get(i), true, null));
                            } else {
                                apiResult.addApiResult(setNamesArray[i], ApiResult.createApiResult(startTime, endTime, new ArrayList<>(), true, null));
                            }
                        }
                    }
                }
                apiResult.put(PARAM_MAP, parameterMap);
                return apiResult;
            } else {
                apiResult = ApiResult.createApiResult(startTime, endTime, resultList.get(0), true, null);
                apiResult.put(PARAM_MAP, parameterMap);
                return apiResult;
            }
        } catch (Exception e) {
            logger.error("Procedure Call Error: api = {}", apiContext.getApiId(), e);
            return ApiResult.createApiErrorResult("Procedure Call Error", e);
        }
    }

    private String getMapperId(DbRequest dbRequest, ApiContext apiContext) {
        String mapperId = dbRequest.getMapperId();
        if (dbRequest.getEval()) {
            String jsKey = makeRequestKey(apiContext);
            JexlScript js = scriptMap.get(jsKey);
            if (js == null) {
                js = jexl.createScript(mapperId);
                this.scriptMap.put(jsKey, js);
            }
            MapContext context = new MapContext();
            context.set(CONTEXT_PARAM, apiContext.getCheckedParamMap());
            mapperId = (String) js.execute(context);
        }
        return mapperId;
    }

    @Override
    public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
        ApiContext apiContext = asyncRequestContext.getApiContext();
        DbRequest dbRequest = (DbRequest) asyncRequestContext.getRequest();
        SqlSession sqlSession = null;
        try {
            sqlSession = this.sessionFactory.getSqlSession(apiContext.getApiPath());
            if (dbRequest
                    .getDmlType()
                    .equals(DbRequest.DML_TYPE_SELECT)) {
                // 결과를 반환할 수 없으므로 수행하지 않음
            } else {
                if (dbRequest
                        .getDmlType()
                        .equals(DbRequest.DML_TYPE_INSERT)) {
                    insert(sqlSession, dbRequest.getMapperId(), apiContext.getCheckedParamMap());
                } else if (dbRequest
                        .getDmlType()
                        .equals(DbRequest.DML_TYPE_UPDATE)) {
                    update(sqlSession, dbRequest.getMapperId(), apiContext.getCheckedParamMap());
                } else if (dbRequest
                        .getDmlType()
                        .equals(DbRequest.DML_TYPE_DELETE)) {
                    delete(sqlSession, dbRequest.getMapperId(), apiContext.getCheckedParamMap());
                }
                sqlSession.commit();
            }
        } catch (Exception e) {
            if (sqlSession != null) {
                sqlSession.rollback();
            }
            logger.error("request exception : {}", e, e);
        } finally {
            if (sqlSession != null) {
                sqlSession.close();
            }
        }
    }

    private List<Map<String, Object>> select(SqlSession sqlSession, String mapperId, Map<String, Object> parameterMap) {
        List<Map<String, Object>> result = sqlSession.selectList(mapperId, parameterMap);
        return result;
    }

    private List<Object> call(SqlSession sqlSession, String mapperId, Map<String, Object> parameterMap) {
        List<Object> resultList = sqlSession.selectList(mapperId, parameterMap);
        return resultList;
    }

    private List<Map<String, Object>> insert(SqlSession sqlSession, String mapperId, Map<String, Object> parameterMap) {
        int insertCount = sqlSession.insert(mapperId, parameterMap);
        return makeCountResult("insertCount", insertCount);
    }

    private List<Map<String, Object>> update(SqlSession sqlSession, String mapperId, Map<String, Object> parameterMap) {
        int updateCount = sqlSession.update(mapperId, parameterMap);
        return makeCountResult("updateCount", updateCount);
    }

    private List<Map<String, Object>> delete(SqlSession sqlSession, String mapperId, Map<String, Object> parameterMap) {
        int deleteCount = sqlSession.delete(mapperId, parameterMap);
        return makeCountResult("deleteCount", deleteCount);
    }

    private List<Map<String, Object>> makeCountResult(String name, int count) {
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        HashMap<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(name, count);
        resultList.add(resultMap);
        return resultList;
    }
}
