/**
 * NSP MAS MPS FcmErrorType.java 2018-03-12
 */
package jmnet.moka.web.push.support.code;

/**
 * <pre>
 * FCM 에러 메시지 유형
 * Project : moka
 * Package : jmnet.moka.web.push.support.code
 * ClassName : FcmErrorType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum FcmErrorType {
    /**
     * 누락된 등록 토큰
     */
    MISSING_REGISTRATION(200, "MissingRegistration"),
    /**
     * 잘못된 등록 토큰
     */
    INVALID_REGISTRATION(200, "InvalidRegistration"),
    /**
     * 등록되지 않은 기기
     */
    NOT_REGISTERED(200, "NotRegistered"),
    /**
     * 잘못된 패키지 이름
     */
    INVALID_PACKAGE_NAME(200, "InvalidPackageName"),
    /**
     * 일치하지 않는 발신자
     */
    MISMATCH_SENDER_ID(200, "MismatchSenderId"),
    /**
     * 잘못된 매개변수
     */
    INVALID_PARAMETERS(200, "InvalidParameters"),
    /**
     * 너무 큰 메시지
     */
    MESSAGE_TOO_BIG(200, "MessageTooBig"),
    /**
     * 잘못된 데이터 키
     */
    INVALID_DATA_KEY(200, "InvalidDataKey"),
    /**
     * 잘못된 수명
     */
    INVALID_TTL(200, "InvalidTtl"),
    /**
     * 기기 메시지 비율 초과
     */
    DEVICE_MESSAGE_RATE_EXCEEDED(200, "DeviceMessageRateExceeded"),
    /**
     * 주제 메시지 비율 초과
     */
    TOPICS_MESSAGE_RATE_EXCEEDED(200, "TopicsMessageRateExceeded"),
    /**
     * 잘못된 APN 인증 정보
     */
    INVALID_APNS_CREDENTIAL(200, "InvalidApnsCredential"),
    /**
     * 전송자ID가 틀림
     */
    SENDER_ID_MISMATCH(200, "MismatchSenderId"),
    /**
     * 시간 초과 5XX, 200
     */
    UNAVAILABLE(503, "Unavailable"),
    /**
     * 내부 서버 오류 500, 200
     */
    INTERNAL_SERVER_ERROR(500, "InternalServerError"),
    /**
     * 인증 오류
     */
    FAIL_AUTHENTICATION(401),
    /**
     * 잘못된 JSON
     */
    INVALID_JSON(400);


    /**
     * 오류코드. HTTP 코드
     */
    private int errorCode;
    /**
     * 오류 메시지
     */
    private String errorMessage;



    /**
     * 생성자
     *
     * @param errorCode    오류코드
     * @param errorMessage 오류메시지
     */
    private FcmErrorType(final int errorCode, final String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    /**
     * 생성자
     *
     * @param errorCode 오류코드
     */
    private FcmErrorType(final int errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 생성자
     *
     * @param errorMessage 오류메시지
     */
    private FcmErrorType(final String errorMessage) {
        this.errorMessage = errorMessage;
    }

    /**
     * 오류여부를 확인한다.
     *
     * @param returnCode HTTP 리턴코드
     * @param message    메시지
     * @return 오류여부
     */
    public static boolean isError(final int returnCode, final String message) {
        boolean error = false;

        for (FcmErrorType type : FcmErrorType.values()) {
            if ((type.errorCode != 0 && type.errorCode == returnCode && type.errorMessage != null && type.errorMessage.equals(message)) || (
                    type.errorCode == returnCode && type.errorMessage == null) || (type.errorCode == 0 && (returnCode == 200 || (returnCode < 600
                    && returnCode >= 500)) && type.errorMessage != null && type.errorMessage.equals(message))) {
                error = true;
                break;
            }
        }

        return error;
    }

    public static boolean isError(FcmErrorType fcmError) {
        boolean error = false;

        for (FcmErrorType type : FcmErrorType.values()) {
            if ((type.errorCode != 0 && type.errorCode == fcmError.errorCode && type.errorMessage != null && type.errorMessage.equals(
                    fcmError.errorMessage)) || (type.errorCode == fcmError.errorCode && type.errorMessage == null) || (type.errorCode == 0 && (
                    fcmError.errorCode == 200 || (fcmError.errorCode < 600 && fcmError.errorCode >= 500)) && type.errorMessage != null
                    && type.errorMessage.equals(fcmError.errorMessage))) {
                error = true;
                break;
            }
        }

        return error;
    }

    /**
     * 오류 메시지로 디바이스 토큰 정보 삭제할 여부를 확인한다.
     *
     * @param returnCode HTTP 리턴코드
     * @param message    메시지
     * @return 디바이스 토큰 삭제 여부
     */
    public static boolean isDeviceDelete(final int returnCode, final String message) {
        return (INVALID_REGISTRATION.errorCode == returnCode && INVALID_REGISTRATION.errorMessage.equals(message)) || (
                NOT_REGISTERED.errorCode == returnCode && NOT_REGISTERED.errorMessage.equals(message));
    }

    /**
     * 디바이스 토큰 정보 삭제할 여부를 확인한다.
     *
     * @param fcmErrorType FCM 에러 메시지 유형
     * @return 디바이스 토큰 삭제 여부
     */
    public static boolean isDeviceDelete(FcmErrorType fcmErrorType) {
        return fcmErrorType == INVALID_REGISTRATION || fcmErrorType == NOT_REGISTERED;
    }

    /**
     * 재시도할 오류인지 확인한다. 서버 오류나 접속 지연의 경우에만 재시도할 오류로 본다.
     *
     * @param returnCode HTTP 리턴코드
     * @param message    메시지
     * @return 재시도 여부
     */
    public static boolean isRetryError(final int returnCode, final String message) {
        return (INTERNAL_SERVER_ERROR.errorCode == returnCode && INTERNAL_SERVER_ERROR.errorMessage.equals(message)) || (
                UNAVAILABLE.errorCode == returnCode && UNAVAILABLE.errorMessage.equals(message));
    }

    /**
     * FCM 에러 메시지 유형을 가져온다.
     *
     * @param returnCode HTTP 리턴코드
     * @param message    메시지
     * @return FCM 에러 메시지 유형
     */
    public static FcmErrorType getType(final int returnCode, final String message) {
        FcmErrorType fcmErrorType = null;

        if (returnCode > 500) {
            fcmErrorType = FcmErrorType.UNAVAILABLE;
        } else if (returnCode == 500) {
            fcmErrorType = FcmErrorType.INTERNAL_SERVER_ERROR;
        } else {
            for (FcmErrorType type : FcmErrorType.values()) {
                if ((message != null && message.equals(type.errorMessage)) || (returnCode == type.errorCode && type.errorMessage == null)) {
                    fcmErrorType = type;
                    break;
                }
            }
        }

        return fcmErrorType;
    }
}
