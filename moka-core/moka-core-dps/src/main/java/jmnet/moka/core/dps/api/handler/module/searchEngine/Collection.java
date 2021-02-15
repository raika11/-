package jmnet.moka.core.dps.api.handler.module.searchEngine;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.simple.parser.ParseException;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.core.dps.api.searchEngine
 * ClassName : SearchQueryResult
 * Created : 2020-11-23 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-23 오전 8:45
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Collection extends ResultParser {
    @JsonProperty("Id")
    private String id;
    @JsonProperty("Count")
    private int count;
    @JsonProperty("TotalCount")
    private int totalCount;
    @JsonProperty("DocumentList")
    private List<Object> documentList;

    public Collection(Object collectionObject)
            throws ParseException, java.text.ParseException {
        this.id = (String)getObject(collectionObject, ID);
        parse(collectionObject);
    }

    private void parse(Object collectionObject)
            throws java.text.ParseException {
        Object documentSet = getObject(collectionObject,DOCUMENT_SET);
        this.totalCount = getInt(documentSet,TOTAL_COUNT);
        this.count = getInt(documentSet,COUNT);
        this.documentList = new ArrayList<>();
        Object docList = getObject(documentSet,DOCUMENT);
        if ( docList instanceof List) {
            this.documentList = new ArrayList<>(this.count);
            for ( Object docObject : (List)docList) {
                Object fieldObject = getObject(docObject,FIELD);
                convertArticle(fieldObject);
                this.documentList.add(fieldObject);
            }
        } else {
            this.documentList = EMPTY_DOCUMENT_LIST;
        }
    }

    private void convertArticle(Object object)
            throws java.text.ParseException {
        if ( object instanceof Map) {
            Map map = (Map)object;
            String date = (String)map.get("Date");
            if (McpString.isNotEmpty(date)) {
                map.put("Date",McpDate.dateTimeStr(McpDate.date("yyyyMMddHHmmss",(String)map.get("Date"))));
            }
        }
    }

}
