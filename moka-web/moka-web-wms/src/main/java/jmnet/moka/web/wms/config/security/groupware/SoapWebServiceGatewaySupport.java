package jmnet.moka.web.wms.config.security.groupware;

import java.util.Map;
import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.wms.config.security.exception.GroupwareUserNotFoundException;
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



    public SetReAuthenticationNumberJBOResponse getAuthNumber(String userId) {

        SetReAuthenticationNumberJBO request = new SetReAuthenticationNumberJBO();

        request.setPStrLogonID(userId);
        request.setPStrServiceID(serviceId);

        SetReAuthenticationNumberJBOResponse response = null;
        try {
            response = (SetReAuthenticationNumberJBOResponse) getWebServiceTemplate().marshalSendAndReceive(request,
                    new SoapActionCallback("http://tempuri.org/SetReAuthenticationNumber_JBO"));

        } catch (Exception ex) {
            log.error("groupware auth api error ", ex);
            throw new GroupwareUserNotFoundException(ex.toString());
        }

        return response;
    }

    public GroupWareUserInfo getUserInfo(String userId)
            throws GroupwareUserNotFoundException {

        SetReAuthenticationNumberJBOResponse authNumberResponse = getAuthNumber(userId);
        String jboResult = authNumberResponse.getSetReAuthenticationNumberJBOResult();
        GroupWareUserInfo groupWareUserInfo = null;
        try {
            Map<String, Object> authNumberMap = BeanConverter.jsonToMap(jboResult);
            String authNumber = (String) authNumberMap.getOrDefault("AuthNumber", "");
            if (McpString.isNotEmpty(authNumber)) {
                GetUserInfoWSJBO request = new GetUserInfoWSJBO();
                GetUserInfoWSJBOResponse response = getUserInfo(userId, authNumber);
                groupWareUserInfo = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(response.getGetUserInfoWSJBOResult(), GroupWareUserInfo.class);
            } else {
                throw new GroupwareUserNotFoundException("GroupWare Data error!!");
            }
        } catch (Exception ex) {
            throw new GroupwareUserNotFoundException(ex.toString());
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
