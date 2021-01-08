package jmnet.moka.core.dps.api.handler.module.searchEngine;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
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
public class SearchQueryResult extends ResultParser {
    @JsonProperty("CollectionList")
    private List<Collection> collectionList;

    public SearchQueryResult(String jsonpString)
            throws ParseException, java.text.ParseException {
        parse(stripJsonp(jsonpString));
    }

    private void parse(Object jsonObject)
            throws java.text.ParseException, ParseException {
        Object searchQueryResult = getObject(jsonObject,SEARCH_QUERY_RESLUT);
        Object collectionList = getObject(searchQueryResult,COLLECTION);
        if ( collectionList instanceof List) {
            this.collectionList = new ArrayList<>();
            for ( Object collectionObject : (List)collectionList) {
                this.collectionList.add(new Collection(collectionObject));
            }
        } else {
            this.collectionList = EMPTY_COLLECTION_LIST;
        }
    }

}
