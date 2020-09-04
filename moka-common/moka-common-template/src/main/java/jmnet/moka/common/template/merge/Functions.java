package jmnet.moka.common.template.merge;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

/**
 * 
 * <pre>
 * 템플릿에서 사용할 함수를 정의한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:19:39
 * @author kspark
 */
public class Functions {
	private HashMap<String,SimpleDateFormat> sdfMap = new HashMap<String,SimpleDateFormat>(32);
	private SimpleDateFormat dateInputFormat = new SimpleDateFormat("yyyyMMddHHmmss");
	
    public String upper(String value) {
    	return value.toUpperCase();
    }
    
    public String lower(String value) {
    	return value.toLowerCase();
    }
    
    public String left(String value, int index) {
    	return value.substring(0,index);
    }
    
    public String date(String format) {
    	SimpleDateFormat sdf = this.sdfMap.get(format);
    	boolean isNew = false;
    	if ( sdf == null) {
    		sdf = new SimpleDateFormat(format);
    		isNew = true;
    	}
    	String returnValue = "";
    	try {
    		returnValue = sdf.format(new Date());
    		if ( isNew) {
    			this.sdfMap.put(format, sdf);
    		}
    		return returnValue;
    	} catch ( Exception e) {
    		return "";
    	}
    }
    
    public String date(long millis, String format) {
    	String longToStr = dateInputFormat.format(new Date(millis));
    	return date( longToStr, format );
    }
    
    public String date(String date, String format) {
    	SimpleDateFormat sdf = this.sdfMap.get(format);
    	boolean isNew = false;
    	if ( sdf == null) {
    		sdf = new SimpleDateFormat(format);
    		isNew = true;
    	}
    	String returnValue = "";
    	try {
    		returnValue = sdf.format(this.dateInputFormat.parse(date));
    		if ( isNew) {
    			this.sdfMap.put(format, sdf);
    		}
    		return returnValue;
    	} catch ( Exception e) {
    		return "";
    	}
    }
    
    public String html(String s) {
        StringBuilder builder = new StringBuilder(128);
//        boolean previousWasASpace = false;
        for( char c : s.toCharArray() ) {
//            if( c == ' ' ) {
//                if( previousWasASpace ) {
//                    builder.append("&nbsp;");
//                    previousWasASpace = false;
//                    continue;
//                }
//                previousWasASpace = true;
//            } else {
//                previousWasASpace = false;
//            }
            switch(c) {
                case '<': builder.append("&lt;"); break;
                case '>': builder.append("&gt;"); break;
                case '&': builder.append("&amp;"); break;
                case '"': builder.append("&quot;"); break;
                case '\n': builder.append("<br>"); break;
                // We need Tab support here, because we print StackTraces as HTML
                case '\t': builder.append("&nbsp; &nbsp; &nbsp;"); break;  
                default:
//                    if( c < 128 ) {
                        builder.append(c);
//                    } else {
//                        builder.append("&#").append((int)c).append(";");
//                    }    
            }
        }
        return builder.toString();
    }
}
