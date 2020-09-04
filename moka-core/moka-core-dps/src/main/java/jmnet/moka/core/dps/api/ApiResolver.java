package jmnet.moka.core.dps.api;

import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;

public class ApiResolver {
	private String path;
	private String id;
	public ApiResolver(HttpServletRequest request) {
		String uri = request.getRequestURI();
        String[] splitted = split(uri);
        if (splitted.length >= 2) {
            this.path = splitted[0];
            this.id = splitted[1];
        }
	}
	
	public ApiResolver(String path, String id) {
		this.path = path;
		this.id = id;
	}
	
    private static String[] split(String uri) {
		String[] splitted = Arrays.stream(uri.split("/"))
				  .filter(s->s.length()>0)
				  .toArray(String[]::new);
        return splitted;
    }

    public static String getPath(HttpServletRequest request) {
        String[] splitted = split(request.getRequestURI());
        if (splitted.length >= 1) {
            return splitted[0];
        }
        return null;
	}
	
	public String getPath() {
		return this.path;
	}
	
	public String getId() {
		return this.id;
	}
}
