/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.RequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.db.session.DpsSqlSessionFactory;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Description: 편집폼의 json데이타 조회
 *
 * @author ssc
 * @since 2021-04-26
 */
@Slf4j
public class EditFormModule implements ModuleInterface {

    @Autowired
    private DpsSqlSessionFactory sessionFactory;

    private static final List<Object> EMPTY_LIST = new ArrayList<>();

    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;

    public EditFormModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;
    }

    @Override
    public Object invoke(ApiContext apiContext)
            throws Exception {

        long startTime = System.currentTimeMillis();
        Map<String, Object> checkedParamMap = apiContext.getCheckedParamMap();
        ApiResult apiResult = ApiResult.createApiResult(startTime, System.currentTimeMillis(), EMPTY_LIST, true, null);
        try {
            apiResult.put(RequestHandler.PARAM_MAP, checkedParamMap);

            List<Map<String, Object>> returnList = new ArrayList<>();
            JSONParser jsonParser = new JSONParser();

            List<Map> result = this.call(apiContext, "dps.article.form", checkedParamMap);
            if (result.size() > 0) {
                String formData = result
                        .get(0)
                        .get("FORM_DATA")
                        .toString();
                List<Map<String, Object>> resultList = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(formData, new TypeReference<List<Map<String, Object>>>() {
                        });

                if (resultList.size() > 0) {
                    for (Map<String, Object> groupInfo : resultList) {
                        String temp = groupInfo
                                .get("fields")
                                .toString();
                        System.out.println(temp);
                        //                        List<Object> itemList = ResourceMapper
                        //                                .getDefaultObjectMapper()
                        //                                .readValue(temp, new TypeReference<List<Object>>() {
                        //                                });
                        //                        for (Map<String, Object> item : itemList) {
                        //                            System.out.println(item.get("name"));
                        //                        }

                    }
                }

                apiResult.put(ApiResult.MAIN_DATA, resultList);

            }
            return apiResult;
        } catch (Exception e) {
            log.error("module exception : {} {} {}", apiContext.getApiPath(), apiContext.getApiId(), e.getMessage(), e);
            return apiResult;
        }

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
