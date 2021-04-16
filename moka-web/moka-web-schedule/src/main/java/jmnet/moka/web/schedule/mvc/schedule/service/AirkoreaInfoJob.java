package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.mybatis.dto.AirkoreaInfoJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.AirkoreaInfoJobMapper;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.transaction.Transactional;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.math.BigDecimal;
import java.util.Date;

/**
 * <pre>
 * 대기정보를 조회하여 DB에 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : AirkoreaInfoJob
 * </pre>
 *
 * @author 유영제
 * @since 2021-04-14
 */

@Slf4j
@Component
public class AirkoreaInfoJob extends AbstractScheduleJob {

    @Autowired
    private AirkoreaInfoJobMapper airkoreaInfoJobMapper;

    @Override
    @Transactional
    public void invoke(GenContent info) {

        GenStatus scheduleResult        = info.getGenStatus();
        final String apiServerKey       = "05QdZ02zxM1OXkG3pcdamlAAs2QORORH5JVNzDNbkO4TwPMMT5T9e0rxLT47ol55KzBelXU22E4qutZxEUm1dw%3D%3D";
        final String apiItemCode[]      = {"PM10", "PM25", "O3", "SO2", "CO", "NO2"};
        final String apiDataGubun       = "HOUR";
        final String apiSchCondition    = "MONTH";

        try {
            for(int num = 0; num < apiItemCode.length ; num++) {
                String apiUrl = "http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst?serviceKey=" + apiServerKey +
                                "&numOfRows=3&pageNo=1&itemCode=" + apiItemCode[num] + "&dataGubun=" + apiDataGubun +
                                "&searchCondition=" + apiSchCondition;

                ResponseEntity<String> res      = restTemplateHelper.get(apiUrl);
                String reponseAirXml            = res.getBody();
                DocumentBuilderFactory factory  = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder         = factory.newDocumentBuilder();
                Document document               = builder.parse(new InputSource(new StringReader(reponseAirXml.toString())));
                NodeList nodelist               = document.getElementsByTagName("item");

                for(int idx = 0; idx < nodelist.getLength() ; idx++) {
                    AirkoreaInfoJobDTO airkoreaInfoDTO = new AirkoreaInfoJobDTO();

                    for (Node node = nodelist.item(idx).getFirstChild(); node != null; node = node.getNextSibling()) {
                        if (node.getNodeType() == Node.ELEMENT_NODE) {

                            String val = node.getTextContent();
                            switch(node.getNodeName()) {
                                case "dataTime":    airkoreaInfoDTO.setDataTime(val);                   break;
                                case "itemCode":    airkoreaInfoDTO.setItemCode(val);                   break;
                                case "seoul":       airkoreaInfoDTO.setSeoul(checkNodeValue(val));      break;  // BigDecimal.valueOf(0.55)
                                case "busan":       airkoreaInfoDTO.setBusan(checkNodeValue(val));      break;
                                case "incheon":     airkoreaInfoDTO.setIncheon(checkNodeValue(val));    break;
                                case "daegu":       airkoreaInfoDTO.setDaegu(checkNodeValue(val));      break;
                                case "ulsan":       airkoreaInfoDTO.setUlsan(checkNodeValue(val));      break;
                                case "daejeon":     airkoreaInfoDTO.setDaejeon(checkNodeValue(val));    break;
                                case "gwangju":     airkoreaInfoDTO.setGwangju(checkNodeValue(val));    break;
                                case "sejong":      airkoreaInfoDTO.setSejong(checkNodeValue(val));     break;
                                case "jeju":        airkoreaInfoDTO.setJeju(checkNodeValue(val));       break;
                                case "gyeonggi":    airkoreaInfoDTO.setGyeonggi(checkNodeValue(val));   break;
                                case "gangwon":     airkoreaInfoDTO.setGangwon(checkNodeValue(val));    break;
                                case "gyeongnam":   airkoreaInfoDTO.setGyeongnam(checkNodeValue(val));  break;
                                case "gyeongbuk":   airkoreaInfoDTO.setGyeongbuk(checkNodeValue(val));  break;
                                case "chungnam":    airkoreaInfoDTO.setChungnam(checkNodeValue(val));   break;
                                case "chungbuk":    airkoreaInfoDTO.setChungbuk(checkNodeValue(val));   break;
                                case "jeonnam":     airkoreaInfoDTO.setJeonnam(checkNodeValue(val));    break;
                                case "jeonbuk":     airkoreaInfoDTO.setJeonbuk(checkNodeValue(val));    break;
                            }
                        }
                    }

                    if(checkAirkoreaInfoDTO(airkoreaInfoDTO) && airkoreaInfoJobMapper.insertAirkoreaInfo(airkoreaInfoDTO) != 1) {
                        throw new RuntimeException("대기정보 데이터 생성시에 오류가 발생하였습니다.");
                    }
                }
            }

            scheduleResult.setSendResult(0l);
            scheduleResult.setSendExecTime(0l);

            setFinish(true, info);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    private double checkNodeValue(String value)
    {
        double ret = 0d;
        if(!value.isEmpty() && value.length() > 0) {
            try {
                ret = Double.parseDouble(value);
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        return ret;
    }

    private boolean checkAirkoreaInfoDTO(AirkoreaInfoJobDTO dto)
    {
        boolean ret = true;

        if(dto.getDataTime().isEmpty() || dto.getItemCode().isEmpty()) {
            ret = false;
        }
        return ret;
    }
}
