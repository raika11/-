package jmnet.moka.common.utils;

import java.util.UUID;

/**
 * <pre>
 * uuid 생성 클래스
 * Project : moka
 * Package : jmnet.moka.common.utils
 * ClassName : UUIDGenerator
 * Created : 2020-12-15 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-15 09:59
 */
public class UUIDGenerator {
    private static final Object MUTEX = new Object();

    /**
     * uuid 문자열 반환
     *
     * @return uuid
     */
    public static final String uuid() {
        synchronized (MUTEX) {
            return UUID
                    .randomUUID()
                    .toString();
        }
    }



}
