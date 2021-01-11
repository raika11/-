package jmnet.moka.web.rcv.task.bulkdump.process.basic;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.bulkdump.process.basic
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

    @Override
    public String toString() {
        if( data == null )
            return "";
        return data;
    }

    public static MapString newMapString( Map<String, MapString> dataMap, String key ) {
        MapString mapString = new MapString(key);
        dataMap.put(key, mapString);
        return mapString;
    }
}
