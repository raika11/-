package jmnet.moka.core.tps.common.logger;

import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.service.EditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.common.logger
 * ClassName : TpsLogger
 * Created : 2020-10-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-19 13:15
 */
@Component
@Slf4j
public class TpsLogger {

    private final ActionLogger actionLogger;

    private final EditLogService editLogService;

    public TpsLogger(ActionLogger actionLogger, EditLogService editLogService) {
        this.actionLogger = actionLogger;
        this.editLogService = editLogService;
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     */
    public void success(ActionType actionType, long executedTime) {
        success(actionType, executedTime, null, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void success(ActionType actionType, long executedTime, String msg) {
        success(actionType, executedTime, msg, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType     액션 유형
     * @param executedTime   실행시간
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void success(ActionType actionType, long executedTime, String msg, boolean isEditLogWrite) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.YES, executedTime, msg);
        actionLogger.success(editLog.getMemberId(), actionType, executedTime, msg);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 실패 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void fail(ActionType actionType, long executedTime, String msg) {
        fail(actionType, executedTime, msg, false);
    }

    /**
     * 실패 로그 생성
     *
     * @param actionType     액션 유형
     * @param executedTime   실행시간
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void fail(ActionType actionType, long executedTime, String msg, boolean isEditLogWrite) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, msg);
        actionLogger.fail(editLog.getMemberId(), actionType, executedTime, msg);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 스킵 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void skip(ActionType actionType, long executedTime, String msg) {
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, msg);
        actionLogger.skip(editLog.getMemberId(), actionType, executedTime, msg);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param msg          에러 메세지
     */
    public void error(ActionType actionType, long executedTime, String msg) {
        error(actionType, executedTime, msg, null, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType   액션 유형
     * @param executedTime 실행시간
     * @param t            Throwable
     */
    public void error(ActionType actionType, long executedTime, Throwable t) {
        error(actionType, executedTime, null, t, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType     액션 유형
     * @param executedTime   실행시간
     * @param msg            에러 메세지
     * @param t              Throwable
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(ActionType actionType, long executedTime, String msg, Throwable t, boolean isEditLogWrite) {
        String errorMsg = McpString.defaultValue(msg) + (t != null ? t.getMessage() : "");
        EditLog editLog = makeEditLog(actionType.code(), MokaConstants.NO, executedTime, errorMsg);
        actionLogger.error(editLog.getMemberId(), actionType, executedTime, msg, t);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * HttpServletRequest와 Authentication로 편집 로그 정보를 생성한다.
     *
     * @param action       행위
     * @param successYn    성공 여부
     * @param executedTime 수행시간
     * @param errorMsg     에러 메세지
     * @return EditLog
     */
    private EditLog makeEditLog(String action, String successYn, long executedTime, String errorMsg) {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String memberId = auth != null ? (String) auth.getPrincipal() : MokaConstants.USER_UNKNOWN;

        HttpServletRequest req = RequestContextHolder.getRequestAttributes() != null
                ? ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()
                : null;

        String url = req != null ? McpString.defaultValue(req.getRequestURI(), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String menuId =
                req != null ? McpString.defaultValue(req.getHeader(TpsConstants.HEADER_MENU_ID), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String param = req != null ? McpString.defaultValue(HttpHelper.getParamString(req), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String remoteAddr = req != null ? McpString.defaultValue(HttpHelper.getRemoteAddr(req), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;


        return EditLog
                .builder()
                .action(action)
                .memberId(memberId)
                .menuId(menuId)
                .successYn(successYn)
                .param(param)
                .regIp(remoteAddr)
                .executedTime(executedTime)
                .apiPath(url)
                .build();
    }


}
