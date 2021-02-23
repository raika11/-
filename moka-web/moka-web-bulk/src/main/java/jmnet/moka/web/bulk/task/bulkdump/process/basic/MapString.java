package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import java.util.Map;
import jmnet.moka.common.utils.McpString;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : MapString
 * Created : 2020-12-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-29 029 오후 2:49
 */

@Getter
@Setter
public class MapString {
    private final String key;
    private String data = "";

    public MapString(String key) {
        this.key = key;
    }

    public String getData() {
        return toString();
    }

    @Override
    public String toString() {
        if( data == null )
            return "";
        return data;
    }

    public boolean isEmpty() {
        return McpString.isNullOrEmpty(this.data);
    }

    public static MapString newMapString( Map<String, MapString> dataMap, String key ) {
        MapString mapString = new MapString(key);
        dataMap.put(key, mapString);
        return mapString;
    }

    public boolean contains(CharSequence s) {
        return toString().contains(s);
    }

    public void replaceAll( String regex, String replacement){
        setData( toString().replaceAll(regex, replacement));
    }

    public void replace( CharSequence target, CharSequence replacement){
        setData( toString().replace(target, replacement));
    }

    public void concat( String text ) {
        setData( toString().concat(text));
    }

    public void addDelimiterConcat(String str, String delimiter) {
        if( McpString.isNullOrEmpty( toString() ) )
            concat(delimiter);
        concat( str );
    }
}
