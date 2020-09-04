package jmnet.moka.web.tms.mvc.controller;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class CustomRequestController {

    @GetMapping("/json")
    public void inputForm(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
		response.setContentType("text/html; charset=UTF-8");
		Writer writer = response.getWriter();
        writer.write(String.join(System.getProperty("line.separator"), "<html>", "<body>",
                "<form method='post'>", "<textarea name='template' rows='50' cols='150'>",
                "</textarea>", "<br/><input type='checkbox' name='unescape'/>Unescape",
                "<input type='submit'>",
                "</form>", "</body>",
                "</html>"));
		writer.flush();
		writer.close();
	}

    @PostMapping("/json")
    public ResponseEntity<?> jsonEncode(@RequestParam("template") String template,
            @RequestParam(value = "unescape", required = false) String unescape) {
        if (unescape == null) {
            Map<String, String> map = new HashMap<String, String>();
            map.put("template", template);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } else {
            ObjectMapper mapper = new ObjectMapper();
            try {
                Map<String, Object> map =
                        mapper.readValue(template, new TypeReference<Map<String, Object>>() {
                        });
                String result = convertMap(map);
                return new ResponseEntity<>(result, HttpStatus.OK);

            } catch (IOException e) {
                return new ResponseEntity<>("map 형태가 아니거나 json오류입니다.", HttpStatus.OK);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private String convertMap(Map<String, Object> map) {
        String result = "";
        for (Entry<String, Object> entry : map.entrySet()) {
            Object value = entry.getValue();
            if (value instanceof Map) {
                result += convertMap((Map<String, Object>) value);
            } else if (value instanceof List) {
                result += convertList((List<Object>) value);
            } else {
                result +=
                        entry.getKey() + ":" + (value == null ? "null" : value.toString())
                                + System.lineSeparator();
            }
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    private String convertList(List<Object> list) {
        String result = "";
        for (Object obj : list) {
            if (obj instanceof Map) {
                result += convertMap((Map<String, Object>) obj);
            } else if (obj instanceof List) {
                result += convertList((List<Object>) obj);
            } else {
                result += (obj == null ? "null" : obj.toString()) + System.lineSeparator();
            }
        }
        return result;
    }
}
