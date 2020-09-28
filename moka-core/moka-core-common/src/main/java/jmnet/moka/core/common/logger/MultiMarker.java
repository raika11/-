package jmnet.moka.core.common.logger;

import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;

import org.slf4j.Marker;

import jmnet.moka.common.utils.McpString;

public class MultiMarker implements org.slf4j.Marker {

	private static final long serialVersionUID = 2438877789519766569L;
	private String name = "";
	private final Set<Marker> references = new LinkedHashSet<Marker>();

	public MultiMarker(Marker... markers) {
		references.addAll(Arrays.asList(markers));
		updateName();
	}

	public String getName() {
		return name;
	}

	public void add(Marker reference) {
		references.add(reference);
		updateName();
	}

	public boolean remove(Marker reference) {
		boolean output = references.remove(reference);
		updateName();
		return output;
	}

	private void updateName() {
		name = "";
		StringBuilder builder = new StringBuilder();
		for (Marker ref : references) {
			if (!McpString.isEmpty(name)) {
				builder.append(" ");
			}
			builder.append(ref.getName());
		}
		name = builder.toString();
	}

	public boolean hasChildren() {
		return true;
	}

	public boolean hasReferences() {
		return true;
	}

	public Iterator<Marker> iterator() {
		return references.iterator();
	}

	public boolean contains(Marker other) {
		for (Marker ref : references) {
			if (ref.contains(other)) {
				return true;
			}
		}
		return false;
	}

	public boolean contains(String name) {
		for (Marker ref : references) {
			if (ref.contains(name)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof Marker)) {
			return false;
		}

		final Marker other = (Marker) obj;
		return name.equals(other.getName());
	}

	@Override
	public int hashCode() {
		return name.hashCode();
	}

	@Override
	public String toString() {
		return name;
	}
}
