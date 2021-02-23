package jmnet.moka.web.schedule.config;

import java.text.SimpleDateFormat;
import java.util.Date;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * <pre>
 *
 * 2020. 10. 14. ince 최초생성
 * 날짜형 문자열을 Date 클래스로 변환한다.
 * </pre>
 *
 * @author ince
 * @since 2020. 10. 14. 오후 11:26:30
 */
@Component
public class DTOStringToDateConverter implements Converter<String, Date> {

    @Override
    public Date convert(String source) {
        SimpleDateFormat sdf = new SimpleDateFormat(MokaConstants.JSON_DATE_FORMAT);
        try {
            return McpString.isNotEmpty(source) ? sdf.parse(source) : null;
        } catch (java.text.ParseException pe) {
            return null;
        }
    }

}
