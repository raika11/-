package jmnet.moka.core.dps.api;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.Parameter;
import jmnet.moka.core.dps.api.model.Request;
import jmnet.moka.core.dps.excepton.ParameterException;
import org.apache.ibatis.session.SqlSession;

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
		if ( this.api.hasCookieParameter() && this.apiResolver.hasHttpRequest()) {
			this.addCookieValues();
		}
		this.checkedParamMap = apiParameterChecker.checkParameter(this.api, this.parameterMap);
	}

	private void addCookieValues() {
		Map<String,String> cookieMap = HttpHelper.getCookieMap(apiResolver.getRequest());
		for ( Parameter parameter : this.api.getParameterMap().values() ) {
			if ( parameter.getType().equals(ApiParser.PARAM_TYPE_COOKIE)) {
				String parameterName = parameter.getName();
				this.parameterMap.put(parameterName,cookieMap.get(parameterName));
			}
		}
	}

	public HttpServletRequest getHttpRequest() {
		return this.apiResolver.getRequest();
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
