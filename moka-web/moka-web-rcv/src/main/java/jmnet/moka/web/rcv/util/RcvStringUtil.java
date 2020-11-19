package jmnet.moka.web.rcv.util;

import java.lang.reflect.Array;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvStringUtil
 * Created : 2020-11-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-05 005 오후 5:42
 */

public class RcvStringUtil {

    public static boolean isNumber(String str, int start, int end) {
        if (str == null || str.length() <= start || start >= end) {
            return false;
        }
        if (str.charAt(start) == '-') {
            start++;
        }
        boolean dot = false;
        end = Math.min(str.length(), end);
        for (int i = start; i < end; i++) {
            if (str.charAt(i) == '.') {
                if (dot) {
                    return false;
                }
                dot = true;
            } else if (str.charAt(i) < '0' || str.charAt(i) > '9') {
                return false;
            }
        }
        return true;
    }

    public static String append(Object... obj) {
        if (obj == null || obj.length == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        appendTo(sb, obj);
        return sb.toString();
    }

    public static void appendTo(StringBuilder sb, Object... obj) {
        if (sb == null) {
            return;
        }
        if (obj == null || obj.length == 0) {
            return;
        }
        for (Object o : obj) {
            if (o != null) {
                sb.append(o.toString());
            }
        }
    }

    public static String replaceAll(String text, String... str) {
        return replaceAll(null, text, str);
    }

    public static String replaceAll(StringBuilder sb, String text, String... str) {
        if (text == null || text.length() == 0) {
            return "";
        } else if (str == null || str.length < 2) {
            return text;    // 변경 대상이 없으면 원본을 리턴
        }

        if (sb == null) {
            sb = new StringBuilder();
        }
        int start;
        int end;
        int sbLength = sb.length();
        for (int i = 0; i < str.length; i += 2) {
            if (str[i] == null) {
                continue;
            }
            sb.setLength(sbLength);
            end = 0;
            while (end < text.length()) {
                start = text.indexOf(str[i], end);
                if (start < 0) {
                    sb.append(text, end, text.length());
                    break;
                }
                sb
                        .append(text, end, start)
                        .append(str[i + 1] == null ? "" : str[i + 1]);
                end = start + str[i].length();
            }
            text = sb.substring(sbLength);
        }
        sb.setLength(sbLength);
        return text;
    }

    public static int toInteger(String str, int start, int end, int base) {
        if (str == null) {
            return 0;
        }
        int n;
        char c;
        char ec1 = (char) ('0' + base - 1);
        char ec2 = (char) ('A' + base - 11);
        char ec3 = (char) ('a' + base - 11);
        boolean minus = false;
        int result = 0;
        if (str.length() < end) {
            end = str.length();
        }
        while (start < end) {
            c = str.charAt(start);
            if ((c >= '0' && c <= ec1) || (c >= 'A' && c <= ec2) || (c >= 'a' && c <= ec3)) {
                break;
            } else {
                if (c == '-') {
                    minus = true;
                    break;
                }
                start++;
            }
        }
        for (int i = start; i < end; i++) {
            c = str.charAt(i);
            if (c >= '0' && c <= ec1) {
                n = (c - '0');
            } else if (c >= 'A' && c <= ec2) {
                n = (c - '7');
            } else if (c >= 'a' && c <= ec3) {
                n = (c - 'W');
            } else {
                continue;
            }
            result = result * base + n;
        }
        return minus ? -result : result;
    }

    @SuppressWarnings("unused")
    public static int indexOfIgnoreScope(String text, String s, char openChar, char closeChar, int start, int end) {
        if (text == null || text.length() == 0 || s == null || s.length() == 0) {
            return -1;
        }
        int c;
        boolean inString = false;
        if (text.length() < end) {
            end = text.length();
        }

        for (int i = start; i < end; i++) {
            if (equals(text, s, i) && !inString) {
                return i;
            } else {
                c = text.charAt(i);
                if (c == '\\') {
                    i++;
                } else if (inString) {
                    if (c == closeChar) {
                        inString = false;
                    }
                } else if (c == openChar) {
                    inString = true;
                }
            }
        }
        return -1;
    }

    public static boolean equals(String text, String s, int start) {
        if (text == null || s == null) {
            return false;
        }
        return equals(text, s, start, text.length());
    }

    public static boolean equals(String text, String s, int start, int end) {
        if (text == null || s == null) {
            return false;
        }

        if (start + s.length() > end) {
            return false;
        }
        for (int i = 0; i < s.length(); i++) {
            if (text.charAt(start + i) != s.charAt(i)) {
                return false;
            }
        }
        return true;
    }

    public static int getWidth(String s) {
        int width = 0;
        int n = s.length();
        while (n-- > 0) {
            if (s.charAt(n) > 255) {
                width += 2;
            } else {
                width++;
            }
        }
        return width;
    }

    public static String format(String format, Object... list) {
        StringBuilder sb = new StringBuilder();
        format(sb, format, list);
        return sb.toString();
    }

    public static void format(StringBuilder sb, String format, Object... list) {
        if (format == null) {
            return;
        }
        if (list == null || list.length == 0 || format.length() < 2) {
            sb.append(format);
            return;
        }
        int start;
        int end = 0;
        int mid;
        int index = 0;
        int size;
        String s;
        while (true) {
            start = format.indexOf('{', end);
            if (start < 0 || index >= list.length) {
                sb.append(format, end, format.length());
                break;
            }
            start++;
            mid = format.indexOf('}', start);
            if (mid < 0) {
                sb.append(format, end, format.length());
                break;
            }
            sb.append(format, end, start - 1);
            end = mid;
            size = 0;
            switch (format.charAt(start)) {
                // array 일 경우 클래스명[길이] 로 출력
                case 'a':
                case 'A':
                    if (list[index] != null && list[index]
                            .getClass()
                            .isArray()) {
                        s = append(list[index]
                                .getClass()
                                .getSimpleName(), "[", Array.getLength(list[index]), "]");
                    } else {
                        s = list[index] == null ? "" : list[index].toString();
                    }
                    break;
                // class 명 출력
                case 'c':
                    if (list[index] != null) {
                        s = list[index]
                                .getClass()
                                .getSimpleName();
                    } else {
                        s = "null";
                    }
                    break;
                // class fullname 출력
                case 'C':
                    if (list[index] != null) {
                        s = list[index]
                                .getClass()
                                .getName();
                    } else {
                        s = "null";
                    }
                    break;
                // 줄바꿈 제거 (\n -> \\n)
                case 't':
                case 'T':
                    if (list[index] != null) {
                        s = replaceAll(list[index].toString(), "\n", "\\\\n", "\r", "");
                    } else {
                        s = "";
                    }
                    break;
                default:
                    if (isNumber(format, start, end)) {
                        size = toInteger(format, start, end, 10);
                    }
                    s = list[index] == null ? "" : list[index].toString();
                    break;
            }
            if (size == 0) {
                sb.append(s);
            } else {
                int width = getWidth(s);
                if (size > 0) {
                    if (size < width) {
                        sb.append(s, 0, size);
                    } else {
                        sb.append(s);
                        size = size - width;
                        while (size-- > 0) {
                            sb.append(' ');
                        }
                    }
                } else {
                    size = -size;
                    if (size > width) {
                        size = size - width;
                        while (size-- > 0) {
                            sb.append(' ');
                        }
                        sb.append(s);
                    } else {
                        sb.append(s, 0, Math.min(s.length(), size));
                    }
                }
            }

            end++;
            index++;

        }
    }
}
