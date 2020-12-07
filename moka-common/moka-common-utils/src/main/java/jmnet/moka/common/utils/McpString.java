package jmnet.moka.common.utils;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.Cipher;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.time.FastDateFormat;
import org.springframework.lang.Nullable;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

/**
 * MCP String Util 클래스 org.springframework.util.StringUtils 상속
 *
 * @author ince
 */
public class McpString extends StringUtils {

    private final static String URI_REGEX = "\\{[A-z0-9]*\\}";

    public final static String YES = "Y";
    public final static String NO = "N";
    public final static String DELETE = "D";


    /**
     * <pre>
     * value 가 null 또는 empty 인지 체크 한다.
     * </pre>
     *
     * @param value
     * @return empty true/false
     */
    public static boolean isEmpty(Object value) {
        if (value == null) {
            return true;
        }
        if (value instanceof String) {
            return StringUtils.isEmpty((String) value);
        } else if (value instanceof String[]) {
            String[] values = (String[]) value;
            return (values.length < 1);
        } else if (value instanceof Collection<?>) {
            if (((Collection<?>) value).size() < 1) {
                return true;
            }
        }
        return false;
    }



    /**
     * 값이 Null 또는 Empty인지 체크
     *
     * @param str 문자열
     * @return 빈문자열 여부
     */
    public static boolean isNullOrEmpty(Object str) {
        return isEmpty(str);
    }

    /**
     * 값이 있는지 여부
     *
     * @param str
     * @return
     */
    public static boolean isNotEmpty(@Nullable Object str) {
        return !isEmpty(str);
    }

    /**
     * <pre>
     * values 배열 요소에 null 또는 empty 값이 있는지 여부를 체크 한다.
     * </pre>
     *
     * @param values
     * @return 포함 여부
     */
    public static boolean containsEmpty(String... values) {
        if (values == null) {
            return true;
        }
        for (String value : values) {
            if (value == null || isEmpty(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * url 파라미터를 Map 형태로 전달한다.
     *
     * @param value
     * @return
     */
    public static Map<String, String> getUrlParamMap(String value) {
        String url = value;
        Map<String, String> paramMap = new HashMap<>();
        if (!isEmpty(value)) {
            if (url.indexOf("?") > -1) {
                url = url.substring(url.indexOf("?") + 1);
            }

            String[] params = url.split("&");
            for (String param : params) {
                String[] paramInfo = param.split("=");
                if (paramInfo.length == 2) {
                    paramMap.put(paramInfo[0], paramInfo[1]);
                }
            }

        }
        return paramMap;
    }



    /**
     * <pre>
     * RESTFul 리소스 URI 를 리턴 한다.
     * </pre>
     *
     * @param sourceUri     url
     * @param pathVariables pathVariables
     * @return URI
     */
    public static String genUriWithPathVariables(String sourceUri, String... pathVariables) {
        String resultUri = null;
        if (pathVariables != null) {
            Matcher matcher = Pattern
                    .compile(URI_REGEX)
                    .matcher(sourceUri);
            int matchedCount = 0;
            while (matcher.find()) {
                matchedCount++;
            }
            if (pathVariables.length == matchedCount) {
                resultUri = sourceUri;
                for (String pathVariable : pathVariables) {
                    resultUri = resultUri.replaceFirst(URI_REGEX, pathVariable);
                }
            } else {
                throw new RuntimeException(
                        "path valiables count mismatched.\nsourceUri is " + sourceUri + "\npathVariables is " + Arrays.toString(pathVariables));
            }
        } else {
            throw new RuntimeException("path valiable is null, abd sourceUri is " + sourceUri);
        }
        return resultUri;
    }

    /**
     * <pre>
     * RESTFul 리소스 URI 를 리턴 한다.
     * </pre>
     *
     * @param uri
     * @param pathVariables
     * @return URI
     */
    public static String genAwareUriWithPathVariables(String uri, String... pathVariables) {
        String resultUri = uri;
        if (pathVariables != null) {
            Matcher matcher = Pattern
                    .compile(URI_REGEX)
                    .matcher(uri);
            int matchedCount = 0;
            while (matcher.find()) {
                matchedCount++;
            }
            if (matchedCount > pathVariables.length) {
                throw new RuntimeException(
                        String.format("path valiables count mismatched. uri is '%s' pathVariables is '%s'", uri, Arrays.toString(pathVariables)));
            } else {
                for (int i = 0; i < matchedCount; i++) {
                    resultUri = resultUri.replaceFirst(URI_REGEX, pathVariables[i]);
                }
            }
        } else {
            throw new RuntimeException(String.format("path valiable is null, abd uri is '%s'", uri));
        }
        return resultUri;
    }

    /**
     * value가 빈값일때 빈문자열로 리턴
     *
     * @param value 값
     * @return 값
     */
    public static String defaultValue(String value) {
        return defaultValue(value, "");
    }

    /**
     * value가 빈값일때 빈문자열로 리턴
     *
     * @param value 값
     * @return 값
     */
    public static String defaultValue(Object value) {
        return defaultValue(value, "");
    }

    /**
     * value가 빈값일때 defaultValue를 리턴
     *
     * @param value        값
     * @param defaultValue 기본값
     * @return 값
     */
    public static String defaultValue(String value, String defaultValue) {
        if (isEmpty(value)) {
            return defaultValue;
        }
        return value;
    }

    /**
     * value가 빈값일때 defaultValue를 리턴
     *
     * @param value        값
     * @param defaultValue 기본값
     * @return 값
     */
    public static String defaultValue(Object value, String defaultValue) {
        if (isEmpty(value)) {
            return defaultValue;
        }
        return String.valueOf(value);
    }

    /**
     * <pre>
     * value 값이 없다면 defaultValue 값을 리턴 한다.
     * </pre>
     *
     * @param value        String
     * @param defaultValue
     * @return String
     */
    public static String nvl(String value, String defaultValue) {
        if (value != null) {
            return value;
        } else {
            return defaultValue;
        }
    }

    /**
     * <pre>
     * value 값이 없다면 defaultValue 값을 리턴 한다.
     * </pre>
     *
     * @param value        Object
     * @param defaultValue
     * @return String
     */
    public static String nvl(Object value, String defaultValue) {
        if (value != null) {
            return String.valueOf(value);
        } else {
            return defaultValue;
        }
    }

    /**
     * <pre>
     * value 값이 없다면 defaultValue 값을 리턴 한다.
     * </pre>
     *
     * @param value
     * @param defaultValue
     * @return Integer
     */
    public static Integer nvl(Integer value, Integer defaultValue) {
        if (value != null) {
            return value;
        } else {
            return defaultValue;
        }
    }


    /**
     * <pre>
     * value 파라미터 값을 integer 객체의 값으로 변환한 값을 리턴
     * </pre>
     *
     * @param value
     * @return Integer
     */
    public static Integer getInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof String) {
            return Integer.valueOf((String) value);
        } else if (value instanceof BigDecimal) {
            return ((BigDecimal) value).intValue();
        } else if (value instanceof BigInteger) {
            return ((BigInteger) value).intValue();
        } else if (value instanceof Long) {
            return ((Long) value).intValue();
        }
        return (Integer) value;
    }

    /**
     * <pre>
     * value 파라미터 값을 Long 객체의 값으로 변환한 값을 리턴
     * </pre>
     *
     * @param value
     * @return Long
     */
    public static Long getLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer) {
            return (Long) value;
        } else if (value instanceof BigDecimal) {
            return ((BigDecimal) value).longValue();
        } else if (value instanceof BigInteger) {
            return ((BigInteger) value).longValue();
        } else if (value instanceof Long) {
            return ((Long) value).longValue();
        }
        return (Long) value;
    }

    /**
     * <pre>
     * 날짜 포멧에 해당하는 문자열 값을 리턴
     * </pre>
     *
     * @param format
     * @return Format String
     */
    public static String getFormattedString(String format) {
        return FastDateFormat
                .getInstance(format)
                .format(Calendar.getInstance());
    }

    /**
     * <pre>
     * 날짜 포멧에 해당하는 문자열 값을 리턴
     * </pre>
     *
     * @param format
     * @param date
     * @return Format String
     */
    public static String getFormattedString(final String format, final Date date) {
        return FastDateFormat
                .getInstance(format)
                .format(date);
    }


    public static String getFormattedString(final String format, final String dateString) {
        int yyyy = 0;
        int month = 0;
        int day = 0;
        int hour = 0;
        int minute = 0;
        int second = 0;
        Date date = new Date();
        if (dateString != null && dateString.length() == 14) {
            yyyy = Integer.parseInt(dateString.substring(0, 4));
            month = Integer.parseInt(dateString.substring(4, 6));
            day = Integer.parseInt(dateString.substring(6, 8));
            hour = Integer.parseInt(dateString.substring(8, 10));
            minute = Integer.parseInt(dateString.substring(10, 12));
            second = Integer.parseInt(dateString.substring(12, 14));

            Calendar cal = Calendar.getInstance();

            cal.set(Calendar.YEAR, yyyy);
            cal.set(Calendar.MONTH, month - 1);
            cal.set(Calendar.DATE, day);

            cal.set(Calendar.HOUR_OF_DAY, hour);
            cal.set(Calendar.MINUTE, minute);
            cal.set(Calendar.SECOND, second);

            date = cal.getTime();
        }
        return FastDateFormat
                .getInstance(format)
                .format(date);
    }



    /**
     * <pre>
     * 성공 여부 리턴
     * </pre>
     *
     * @param delimiterValues
     * @return success true / false
     */
    public static boolean successCode(String[] delimiterValues) {
        if (delimiterValues == null) {
            return false;
        }
        String resultCode = delimiterValues[0];
        if ("1".equals(resultCode) || "true".equals(resultCode)) {
            return true;
        }
        return false;
    }

    public static final String[] CONTROL_CHARS = {"\n", "\t", "\r\n"};


    /**
     * <pre>
     * List 값을 "key1, key2, key3, ..." 으로 변환
     * </pre>
     *
     * @param values
     * @return String
     */
    public static String toCommaDelimitedString(String... values) {
        if (values == null) {
            return null;
        }
        StringBuilder builder = new StringBuilder();
        int index = 0;
        for (String val : values) {
            if (index == 0) {
                builder.append(val);
            } else {
                builder
                        .append(", ")
                        .append(val);
            }
            ++index;
        }
        return builder.toString();
    }

    /**
     * <pre>
     * Object 값을 Boolean형로 변환
     * </pre>
     *
     * @param val
     * @return boolean
     */
    public static boolean getBoolean(Object val) {
        if (val == null) {
            return false;
        }
        if (val instanceof Boolean) {
            return (Boolean) val;
        } else if (val instanceof String) {
            String sval = (String) val;
            if ("1".equals(sval) || "true".equalsIgnoreCase(sval)) {
                return true;
            }
        } else if (val instanceof Integer) {
            if (((Integer) val).intValue() < 1) {
                return false;
            }
            return true;
        } else if (val instanceof Long) {
            if (((Long) val).intValue() < 1) {
                return false;
            }
            return true;
        } else if (val instanceof BigDecimal) {
            if (((BigDecimal) val).intValue() < 1) {
                return false;
            }
            return true;
        } else if (val instanceof BigInteger) {
            if (((BigInteger) val).intValue() < 1) {
                return false;
            }
            return true;
        }
        return false;
    }


    /**
     * <pre>
     * RSA Key 암호화
     * </pre>
     *
     * @param token
     * @return RSA Key String
     * @throws Exception
     */
    public static String generateRsaKey(String token)
            throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);

        KeyPair keyPair = keyPairGenerator.genKeyPair();
        Key publicKey = keyPair.getPublic(); // 공개키
        /**
         * Key privateKey = keyPair.getPrivate(); // 개인키
         *
         * KeyFactory keyFactory = KeyFactory.getInstance("RSA");
         *
         * RSAPublicKeySpec publicKeySpec = keyFactory.getKeySpec(publicKey,
         * RSAPublicKeySpec.class); RSAPrivateKeySpec privateKeySpec =
         * keyFactory.getKeySpec(privateKey, RSAPrivateKeySpec.class);
         **/
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] arrCipherData = cipher.doFinal(token.getBytes()); // 암호화된 데이터(byte 배열)
        String strCipher = new String(arrCipherData);

        return strCipher;

    }

    /**
     * <pre>
     * RSA Key 복호화
     * </pre>
     *
     * @param privateKey
     * @param token
     * @return 복호화 된 String
     * @throws Exception
     */
    public static String decryptionRsaKey(Key privateKey, String token)
            throws Exception {

        Cipher cipher = Cipher.getInstance("RSA");

        byte[] arrCipherData = cipher.doFinal(token.getBytes()); // 암호화된 데이터(byte 배열)
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] arrData = cipher.doFinal(arrCipherData);
        String strResult = new String(arrData);

        return strResult;

    }

    /**
     * <pre>
     * html로 전달되는 문자열에 white space를 제거한 문자열을 리턴
     * </pre>
     *
     * @param text 변환 문자열
     * @return white space를 제거한 문자열
     */
    public static String replaceUnicode(String text) {
        // HexaCode : C2A0 ( No-break Space ) 변환
        String escape = StringEscapeUtils.escapeJava(text);
        escape = escape.replaceAll("u00A0", "u0020");
        // HexaCode : &nbsp; 변환
        escape = escape.replaceAll("&nbsp;", " ");
        return StringEscapeUtils.unescapeJava(escape);
    }

    /**
     * <pre>
     * 문자열을 헥사 바이트 배열로 변환
     * </pre>
     *
     * @param hexCode
     * @return byte 배열
     */
    public static byte[] hex2byte(String hexCode) {
        byte twoByte[] = new byte[2];
        twoByte[0] = (byte) Integer.parseInt(hexCode.substring(0, 2), 16);
        twoByte[1] = (byte) Integer.parseInt(hexCode.substring(2, 4), 16);
        return twoByte;
    }

    /**
     * <pre>
     * 인코딩 변환
     * </pre>
     *
     * @param code     문자열
     * @param encoding encoding 타입
     * @return 변환된 문자열
     * @throws UnsupportedEncodingException
     */
    public static String convertEncoding(String code, String encoding)
            throws UnsupportedEncodingException {
        return new String(hex2byte(code), encoding);
    }

    /**
     * <pre>
     * html 문자열을 엔티티로 변환
     * </pre>
     *
     * @param html html 문자열
     * @return escape된 html
     */
    public static String escapeHtml(String html) {
        StringBuffer strBuff = new StringBuffer();
        for (int j = 0; j < html.length(); j++) {
            char c = html.charAt(j);
            switch (c) {
                case '<':
                    strBuff.append("&lt;");
                    break;
                case '>':
                    strBuff.append("&gt;");
                    break;
                case '&':
                    strBuff.append("&amp;");
                    break;
                case '"':
                    strBuff.append("&quot;");
                    break;
                case '\'':
                    strBuff.append("&apos;");
                    break;
                default:
                    strBuff.append(c);
                    break;
            }
        }
        return strBuff.toString();
    }

    /**
     * <pre>
     * html 문자열을 엔티티로 변환
     * </pre>
     *
     * @param html html 문자열
     * @return escape된 html
     */
    public static String unescape(String html) {
        return HtmlUtils.htmlUnescape(html.replaceAll("&apos;", "\'"));
    }

    /**
     * <pre>
     * 문자열이 maxCount보다 긴 경우 substring하고 말줄임표 추가
     * </pre>
     *
     * @param str      값
     * @param maxCount 최대 길이
     * @return 최대길이까지 자른 문자열+'...'
     */
    public static String ellipse(String str, int maxCount) {
        return ellipse(str, maxCount, false);
    }

    /**
     * 문자열이 maxCount보다 긴 경우 substring하고 말줄임표 추가
     *
     * @param str      문자열
     * @param maxCount 최대길이
     * @param isByte   byte수로 자를지 여부
     * @return 문자열
     */
    public static String ellipse(String str, int maxCount, boolean isByte) {
        if (!isEmpty(str)) {
            if (!isByte) {
                if (str.length() > maxCount) {
                    str = str.substring(0, maxCount) + "...";
                }
            } else {
                int byteLength = 0;
                int realByteLength = byteLength(str);
                if (realByteLength > maxCount) {
                    str = byteCut(str, maxCount) + "...";
                }
            }
        }
        return str;
    }

    /**
     * byte수로 문자열을 자른다.
     *
     * @param str      문자열
     * @param maxCount 최대 길이
     * @return 문자열
     */
    public static String byteSubstring(String str, int maxCount) {
        if (!isEmpty(str)) {
            int byteLength = 0;
            int realByteLength = byteLength(str);
            if (realByteLength > maxCount) {
                str = byteCut(str, maxCount);
            }
        }
        return str;
    }

    /**
     * byte수로 문자열을 자른다.
     *
     * @param str      문자열
     * @param maxCount 최대 길이
     * @return 문자열
     */
    private static String byteCut(String str, int maxCount) {
        int byteLength = 0;
        StringBuffer sb = new StringBuffer(McpString
                .defaultValue(str)
                .length());
        for (int i = 0; i < str.length() && byteLength < maxCount; i++) {
            byteLength += String
                    .valueOf(str.charAt(i))
                    .getBytes().length;
            if (byteLength < maxCount) {
                sb.append(str.charAt(i));
            }
        }
        str = sb.toString();
        return str;
    }


    public static int byteLength(String str) {
        int byteLength = 0;
        for (int i = 0; i < str.length(); i++) {
            byteLength += String
                    .valueOf(str.charAt(i))
                    .getBytes().length;
        }
        return byteLength;
    }


    /**
     * <pre>
     * 문장의 길이가 최대 길이 보다 긴 경우
     * 개행문자를 추가한다.
     * </pre>
     *
     * @param str      값
     * @param maxCount 최대 길이
     * @return 최대길이까지 자른 후 개행시킨 문자열
     */
    public static String forceLineBreak(String str, int maxCount) {
        String returnVal = "";
        if (!isEmpty(str)) {
            String[] values = str.split("\r\n");
            int lineCnt = 0;
            for (String value : values) {
                lineCnt++;
                int length = value.length();
                if (length > maxCount) {
                    int cutCnt = length / maxCount;
                    if (cutCnt == (cutCnt * maxCount)) {
                        cutCnt++;
                    }
                    int start = 0;
                    for (int i = 0; i < cutCnt; i++) {

                        returnVal += value.substring(start, start + maxCount) + "\n";
                        start = start + maxCount;
                    }
                    returnVal += value.substring(start);
                } else {
                    returnVal += value;
                }
                if (lineCnt != values.length) {
                    returnVal += "\n";
                }
            }
        }
        return returnVal;
    }

    /**
     * 문자열 배열을 복사한다.
     *
     * @param sourceArray 복사 할 문자열 배열
     * @return 복사한 배열
     */
    public static String[] copyArray(String[] sourceArray) {
        String[] copyArray = null;
        if (sourceArray != null && sourceArray.length > 0) {
            copyArray = new String[sourceArray.length];
            System.arraycopy(sourceArray, 0, copyArray, 0, sourceArray.length);
        }
        return copyArray;
    }

    /**
     * 카멜 표기법으로 되어 있는 문자열을 스네이크 표기법으로 변경 한다.
     *
     * @param key
     * @return String
     */
    public static String convertCamelToSnake(String key) {
        String returnValue = "";
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < key.length(); i++) {
            char c = key.charAt(i);
            if (Character.isUpperCase(c)) {
                sb
                        .append("_")
                        .append(Character.toLowerCase(c));
            } else {
                sb.append(c);
            }
        }
        returnValue = sb.toString();
        return returnValue;
    }

    /**
     * 입력값이 Y인 경우 true, 아니면 false
     *
     * @param yesOrNo Yes or No
     * @return boolean
     */
    public static boolean isYes(String yesOrNo) {
        return defaultValue(yesOrNo, YES).equals(YES);
    }

    /**
     * 입력값이 Y인 경우 true, 아니면 false
     *
     * @param yesOrNo      Yes or No
     * @param defaultValue 기본값
     * @return boolean
     */
    public static boolean isYes(String yesOrNo, String defaultValue) {
        return defaultValue(yesOrNo, defaultValue).equals(YES);
    }

    /**
     * 입력값이 N인 경우 true, 아니면 false
     *
     * @param yesOrNo Yes or No
     * @return boolean
     */
    public static boolean isNo(String yesOrNo) {
        return defaultValue(yesOrNo, NO).equals(NO);
    }

    /**
     * 입력값이 N인 경우 true, 아니면 false
     *
     * @param yesOrNo      Yes or No
     * @param defaultValue 기본값
     * @return boolean
     */
    public static boolean isNo(String yesOrNo, String defaultValue) {
        return defaultValue(yesOrNo, defaultValue).equals(NO);
    }
}
