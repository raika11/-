package jmnet.moka.core.tms.mvc.abtest;

import java.io.Serializable;
import java.time.LocalDateTime;
import jmnet.moka.common.utils.McpString;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.tms.mvc.controller.abtest
 * ClassName : AbTest
 * Created : 2021-04-05 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-04-05 오전 10:55
 */


public class AbTest implements Serializable {
    private static final long serialVersionUID = -4199250436908192770L;
    private String id;
    private String domainId;
    private String componentId;
    private String templateId;
    private String datasetId;
    private String articleId;
    private LocalDateTime start;
    private LocalDateTime end;
    private boolean pause;

    public AbTest() { }
    public AbTest(String id, String domainId, String componentId, String templateId, String datasetId, String articleId, LocalDateTime start, LocalDateTime end, boolean pause) {
        this.id = id;
        this.domainId = domainId;
        this.componentId = componentId;
        this.templateId = templateId;
        this.datasetId = datasetId;
        this.articleId = articleId;
        this.start = start;
        this.end = end;
        this.pause = pause;
    }

    public String getId() {
        return id;
    }

    public String getDomainId() { return domainId;}

    public void setDomainId(String domainId) {
        this.domainId = domainId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComponentId() {
        return componentId;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
    }

    public String getTemplateId() {
        return templateId;
    }

    public boolean hasTemplate() {
        return McpString.isNotEmpty(this.templateId);
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public boolean hasDataset() {
        return McpString.isNotEmpty(this.datasetId);
    }

    public void setDatasetId(String datesetId) {
        this.datasetId = datesetId;
    }

    public String getArticleId() {
        return articleId;
    }

    public void setArticleId(String articleId) {
        this.articleId = articleId;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public boolean isPause() {
        return pause;
    }

    public void setPause(boolean pause) {
        this.pause = pause;
    }
}
