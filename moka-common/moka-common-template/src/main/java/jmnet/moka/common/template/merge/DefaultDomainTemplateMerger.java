package jmnet.moka.common.template.merge;

import java.io.IOException;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.DefaultDataLoader;
import jmnet.moka.common.template.loader.FileTemplateLoader;
import jmnet.moka.common.template.loader.TemplateLoader;

/**
 * <pre>
 * 도메인 단위의 템플릿을 머징한다.
 * 2019. 9. 11. kspark 최초생성
 * </pre>
 * @since 2019. 9. 11. 오후 5:10:49
 * @author kspark
 */
public class DefaultDomainTemplateMerger  {

	private static final Logger logger = LoggerFactory.getLogger(DefaultDomainTemplateMerger.class);
	private HashMap<String, DefaultTemplateMerger> templateMergerMap;
	private String basePath;
	private DataLoader dataLoader;
	private HashMap<String,DataLoader> dataLoaderMap;
	
	public DefaultDomainTemplateMerger(String basePath, String apiHost, String apiPath, String defaultTemplateDomain) {
		this(basePath, new DefaultDataLoader(apiHost, apiPath));
	}
	
	public DefaultDomainTemplateMerger(String basePath, DataLoader dataLoader) {
		this.basePath = basePath;
		this.templateMergerMap = new HashMap<String, DefaultTemplateMerger>(16);
		this.dataLoader = dataLoader;
	}
	
	public DefaultDomainTemplateMerger(String basePath, HashMap<String,DataLoader> dataLoaderMap, String defaultTemplateDomain) {
		this.basePath = basePath;
		this.templateMergerMap = new HashMap<String, DefaultTemplateMerger>(16);
		this.dataLoaderMap = dataLoaderMap;
	}
	
	public StringBuilder merge(String domainId, String templateType, String path, MergeContext context) throws TemplateMergeException {
		DefaultTemplateMerger ftm = this.templateMergerMap.get(domainId);
		if ( ftm == null) {
			try {
				DataLoader domainDataLoader = this.dataLoaderMap.get(domainId);
				if ( domainDataLoader != null ) {
					ftm = new DefaultTemplateMerger(this.basePath+"/"+domainId, domainDataLoader, this.dataLoader);
					this.templateMergerMap.put(domainId, ftm);
					logger.debug("Domain Template Merger Created : {}", domainId);					
				} else {
					throw new IOException("Domain DataLoader Not Found:" + domainId);
				}
			} catch (IOException e) {
				throw new TemplateMergeException("Domain Template Merger Creation Fail",e);
			}
		}
		return ftm.merge(templateType, path, context);
	}

}
