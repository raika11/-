package jmnet.moka.core.dps.api;

import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.Request;
import jmnet.moka.core.dps.excepton.ParameterException;

public class ApiContext {
	private ApiResolver apiResolver;
	private Api api;
	private SqlSession sqlSession;
    private Map<String, String> parameterMap;
	private Map<String,Object> checkedParamMap;
    private ApiResult allResult;
	private Request currentRequest;
    private int currentIndex = -1;
	
	public ApiContext(ApiRequestHelper apiRequestHelper, ApiParameterChecker apiParameterChecker, 
            ApiResolver apiResolver, Map<String, String> parameterMap) throws ParameterException {
		this.apiResolver = apiResolver;
		this.parameterMap = parameterMap;
		this.api = apiRequestHelper.getApi(apiResolver.getPath(), apiResolver.getId());
		this.checkedParamMap = apiParameterChecker.checkParameter(this.api, this.parameterMap);
	}

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	public SqlSession getSqlSession() {
		return this.sqlSession;
	}
	
    public Map<String, String> getParameterMap() {
		return this.parameterMap;
	}
		
	public Map<String,Object> getCheckedParamMap() {
		return this.checkedParamMap;
	}
	
    public void setAllResult(ApiResult allResult) {
        this.allResult = allResult;
    }

    public ApiResult getAllResult() {
        return this.allResult;
    }

	public Api getApi() {
		return this.api;
	}
	
	public String getApiPath() {
		return this.apiResolver.getPath();
	}

	public String getApiId() {
		return this.apiResolver.getId();
	}
	
    //	public void setCurrentRequest(Request request) {
    //		this.currentRequest = request;
    //	}
	
    public boolean hasNextRequest() {
        if (this.api.getRequestList() == null || this.api.getRequestList().size() == 0) {
            return false;
        }
        return this.api.getRequestList().size() - 1 > this.currentIndex;
    }

    public Request nextRequest() {
        this.currentIndex++;
        this.currentRequest = this.api.getRequestList().get(this.currentIndex);
        return this.currentRequest;
    }

	public Request getCurrentRequest() {
		return this.currentRequest;
	}
	
    public int getCurrentRequestIndex() {
        return this.currentIndex;
    }

	public String toString() {
		return apiResolver.getPath()+"/"+apiResolver.getId()+" "+parameterMap.toString();
	}
}
