package jmnet.moka.web.bulk.task.bulkdump.process.basic;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : MediaFullName
 * Created : 2021-01-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-27 027 오후 2:16
 */
public class MediaFullName {
    public static final String getJoongangMediaFullName( String targetCode ) {
        switch(targetCode){
            case "A":
                return "중앙일보::속보";
            case "C":
                return "중앙일보::풍향계";
            case "E":
                return "중앙일보::문화/연예";
            case "F":
                return "중앙일보::정보과학";
            case "G":
                return "중앙일보::스포츠";
            case "I":
                return "중앙일보::경제";
        }
        return "중앙일보";
    }
}
