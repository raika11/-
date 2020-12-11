package jmnet.moka.web.wms.mvc.member.controller;

import io.swagger.annotations.ApiOperation;
import javax.validation.constraints.Size;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.web.wms.config.security.exception.GroupWareException;
import jmnet.moka.web.wms.config.security.exception.UnauthrizedErrorCode;
import jmnet.moka.web.wms.config.security.groupware.GroupWareUserInfo;
import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.member.controller
 * ClassName : GroupWareMemberRestController
 * Created : 2020-12-11 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-11 17:30
 */
@Slf4j
@RestController
@RequestMapping("/api/group-ware")
public class GroupWareMemberRestController extends AbstractCommonController {

    public final SoapWebServiceGatewaySupport groupWareAuthClient;

    public GroupWareMemberRestController(SoapWebServiceGatewaySupport groupWareAuthClient) {
        this.groupWareAuthClient = groupWareAuthClient;
    }

    /**
     * 그룹웨어 사용자 정보 조회
     *
     * @param groupWareUserId 그룹 웨어 아이디 (필수)
     * @return Member정보
     * @throws GroupWareException 그룹웨어에 사용자 정보가 없음
     */
    @ApiOperation(value = "그룹웨어 사용자 정보 조회")
    @GetMapping("/{groupWareUserId}")
    public ResponseEntity<?> getGroupWareMember(
            @PathVariable("groupWareUserId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String groupWareUserId)
            throws MokaException {
        try {
            GroupWareUserInfo groupWareUserInfo = groupWareAuthClient.getUserInfo(groupWareUserId);

            tpsLogger.success(ActionType.SELECT);

            ResultDTO<GroupWareUserInfo> resultDto = new ResultDTO<>(groupWareUserInfo);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (GroupWareException ex) {
            /**
             * 그룹웨어 관련 오류 메세지 처리
             */
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR) {
                throw new MokaException(msg("wms.login.error.GroupwareUserNotFoundException"));
            }
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_PARSING_ERROR) {
                throw new MokaException(msg("wms.login.error.groupware-authnumber"));
            }
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR) {
                throw new MokaException(msg("wms.login.error.groupware-userinfo"));
            }
            throw new MokaException(msg("wms.login.error.groupware"));
        }


    }
}
