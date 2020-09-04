package jmnet.moka.core.tms.template.loader;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.MergeItem;

/**
 * 
 * <pre>
 * DPS 기반의 아이템 정보를 생성한다.
 * jmnet.moka.core.common.ItemConstants.DpsItemConstants의 설정된 
 * 속성명을 jmnet.moka.core.common.ItemConstants 기준으로 변경한다. 
 * 2020. 3. 20. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 3. 20. 오후 5:01:59
 * @author kspark
 */
public class DpsItemFactory extends AbstractItemFactory {
    public final static Logger logger = LoggerFactory.getLogger(DpsItemFactory.class);

    public void setEntry(MergeItem item, Map<String, Object> map,
            List<String> constantNameList) {
        String key;
        Object value;
        for (String constantName : constantNameList) {
            try {
                key = ItemConstants.class.getField(constantName).get(null).toString();
                value = map
                        .get(ItemConstants.DpsItemConstants.class.getField(constantName).get(null));
                item.put(key, value);
            } catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException
                    | SecurityException e) {
                logger.warn("Item field error: {} {} {}", item.getItemType(), constantName,
                        e.toString());
            }
        }
    }
}
