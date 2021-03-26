package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jmnet.moka.core.dps.api.handler.UrlRequestHandler;

public class UrlRequest extends AbstractRequest {
	
	private static List<String> emptyList = new ArrayList<String>();
	private String type;
	private boolean async;
	private String resultName;
	private String selector;
	private String url;
	private List<String> include = emptyList;
	private List<String> exclude = emptyList;
	
	public UrlRequest(String type, boolean async, String resultName, String url, String include, String exclude, String selector) {
		super(type, async, resultName);
		this.url = url;
		this.selector = selector;
		if ( include != null && include.length() > 0) {
			this.include = Arrays.asList(include.split(","));
		}
		if ( exclude != null && exclude.length() > 0) {
			this.exclude = Arrays.asList(include.split(","));
		}
	}

	public String getType() {
		return this.type;
	}
	
	public boolean getAsync() {
		return this.async;
	}
	
	public String getResultName() {
		return this.resultName;
	}
	
	public String getUrl() {
		return this.url;
	}
	
	public String getSelector() {
		return this.selector;
	}
	
	public List<String> getIncude(){
		return this.include;
	}

	public List<String> getExclude(){
		return this.exclude;
	}
	
	@Override
	public Class<?> getHandlerClass() {
		return UrlRequestHandler.class;
	}
	
	public String toString() {
		return String.join("/", this.type,this.url);
	}
}
