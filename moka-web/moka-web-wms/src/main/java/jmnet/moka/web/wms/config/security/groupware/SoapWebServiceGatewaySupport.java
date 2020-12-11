package jmnet.moka.web.wms.config.security.groupware;

import java.io.IOException;
import java.util.Map;
import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.wms.config.security.exception.GroupWareException;
import jmnet.moka.web.wms.config.security.exception.UnauthrizedErrorCode;
import jmnet.moka.web.wms.config.security.groupware.webservice.GetUserInfoWSJBO;
import jmnet.moka.web.wms.config.security.groupware.webservice.GetUserInfoWSJBOResponse;
import jmnet.moka.web.wms.config.security.groupware.webservice.SetReAuthenticationNumberJBO;
import jmnet.moka.web.wms.config.security.groupware.webservice.SetReAuthenticationNumberJBOResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.common.soap
 * ClassName : SoapWebServiceGatewaySupport
 * Created : 2020-12-10 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-10 09:43
 */
@Slf4j
public class SoapWebServiceGatewaySupport extends WebServiceGatewaySupport {

    private String serviceId;

    public SoapWebServiceGatewaySupport(String serviceId) {
        this.serviceId = serviceId;
    }



    public SetReAuthenticationNumberJBOResponse getAuthNumber(String userId)
            throws GroupWareException {

        SetReAuthenticationNumberJBO request = new SetReAuthenticationNumberJBO();

        request.setPStrLogonID(userId);
        request.setPStrServiceID(serviceId);

        SetReAuthenticationNumberJBOResponse response = null;
        try {
            response = (SetReAuthenticationNumberJBOResponse) getWebServiceTemplate().marshalSendAndReceive(request,
                    new SoapActionCallback("http://tempuri.org/SetReAuthenticationNumber_JBO"));

        } catch (Exception ex) {
            log.error("groupware auth api error ", ex);
            throw new GroupWareException(UnauthrizedErrorCode.GROUPWARE_ERROR, ex);
        }

        return response;
    }

    public GroupWareUserInfo getUserInfo(String userId)
            throws GroupWareException {

        SetReAuthenticationNumberJBOResponse authNumberResponse = getAuthNumber(userId);
        String jboResult = authNumberResponse.getSetReAuthenticationNumberJBOResult();
        GroupWareUserInfo groupWareUserInfo = null;
        
        Map<String, Object> authNumberMap = null;
        try {
            authNumberMap = BeanConverter.jsonToMap(jboResult);
            if (McpString.isNotEmpty(authNumberMap.getOrDefault("AuthNumber", "Error"))) {
                throw new GroupWareException(UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR);
            }
        } catch (Exception ex) {
            throw new GroupWareException(UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_PARSING_ERROR);
        }
        String authNumber = (String) authNumberMap.getOrDefault("AuthNumber", "");
        if (McpString.isNotEmpty(authNumber)) {
            GetUserInfoWSJBO request = new GetUserInfoWSJBO();
            GetUserInfoWSJBOResponse response = getUserInfo(userId, authNumber);
            try {
                groupWareUserInfo = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(response.getGetUserInfoWSJBOResult(), GroupWareUserInfo.class);
            } catch (IOException ex) {
                throw new GroupWareException(UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR);
            }
        } else {
            throw new GroupWareException(UnauthrizedErrorCode.GROUPWARE_ERROR);
        }


        return groupWareUserInfo;
    }

    public GetUserInfoWSJBOResponse getUserInfo(String userId, String authNumber) {

        GetUserInfoWSJBO request = new GetUserInfoWSJBO();

        request.setPStrURCode(userId);
        request.setPStrAuthURCode(userId);
        request.setPStrServiceID(serviceId);
        request.setPStrAuthNum(authNumber);

        GetUserInfoWSJBOResponse response = (GetUserInfoWSJBOResponse) getWebServiceTemplate().marshalSendAndReceive(request,
                new SoapActionCallback("http://tempuri.org/GetUserInfo_WS_JBO"));

        return response;
    }

}
