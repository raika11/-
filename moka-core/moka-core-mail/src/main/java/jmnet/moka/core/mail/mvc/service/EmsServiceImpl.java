package jmnet.moka.core.mail.mvc.service;

import jmnet.moka.core.mail.mvc.dto.EmsSendDTO;
import jmnet.moka.core.mail.mvc.entity.AutomailInterface;
import jmnet.moka.core.mail.mvc.repository.AutomailInterfaceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.mail.mvc.service
 * ClassName : EmsMailServiceImpl
 * Created : 2021-02-25 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-25 13:54
 */
@Service
public class EmsServiceImpl implements EmsService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AutomailInterfaceRepository automailInterfaceRepository;

    /**
     * ems 메일 발송
     */
    public EmsSendDTO send(EmsSendDTO emsSend) {
        AutomailInterface automailInterface = modelMapper.map(emsSend, AutomailInterface.class);
        automailInterface = automailInterfaceRepository.save(automailInterface);

        return modelMapper.map(automailInterface, EmsSendDTO.class);
    }

}
