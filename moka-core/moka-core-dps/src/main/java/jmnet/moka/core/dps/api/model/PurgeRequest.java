package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.handler.PurgeRequestHandler;

public class PurgeRequest implements Request {

	private String type;
    private String apiPath;
    private String apiId;
    private List<String> keyList;;
    private boolean async;
	
	
    public PurgeRequest(String type, String apiPath, String apiId, String keys, boolean async) {
		this.type = type;
		this.apiPath = apiPath;
        this.apiId = apiId;
        this.async = async;

        if (McpString.isNotEmpty(keys)) {
            String[] keysplit = keys.trim().split("\\s+");
            this.keyList = Arrays.asList(keysplit);
        } else {
            this.keyList = new ArrayList<String>(0);
        }
	}

	public String getType() {
		return this.type;
	}
	
	public boolean getAsync() {
		return this.async;
	}

    public String getApiPath() {
        return this.apiPath;
    }

    public String getApiId() {
        return this.apiId;
    }

    public List<String> getKeyList() {
        return this.keyList;
    }
	
	@Override
	public Class<?> getHandlerClass() {
        return PurgeRequestHandler.class;
	}
	
	public String toString() {
		return String.join("/", this.type);
	}

    @Override
    public String getResultName() {
        return "PURGE";
    }
}
