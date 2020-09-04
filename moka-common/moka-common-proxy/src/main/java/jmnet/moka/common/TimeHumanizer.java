package jmnet.moka.common;

public class TimeHumanizer {
	public static int parse(String time, Integer defaultValue) {
		if ( time != null && time.length() >= 2) {
			time = time.trim();
			char timeUnit = time.charAt(time.length()-1);
			int timeValue = Integer.parseInt(time.substring(0,time.length()-1)); 
			switch ( timeUnit) {
			case 's' :
			case 'S' :
				return timeValue * 1000;
			case 'm' :
			case 'M' :
				return timeValue * 1000 * 60;
			case 'h' :
			case 'H' :
				return timeValue * 1000 * 60 * 60;
			case 'd' :
			case 'D' :
				return timeValue * 1000 * 60 * 60 * 24;
			}
			return defaultValue;
		} else {
            if (time == null)
                return defaultValue;
            else
                return Integer.parseInt(time);
		}
	}
	
    public static long parseLong(String time, long defaultValue) {
        return (long) parse(time, (int) defaultValue);
    }

	public static int parse(String time) {
		return parse(time, 0);
	}
}
