default: zip

.PHONY: clean

default: zip

schemas/gschemas.compiled:
	glib-compile-schemas --strict ./schemas/

zip: schemas/gschemas.compiled
	zip hidecursor.zip -r README.md schemas metadata.json prefs.js extension.js

clean:
	rm -rf hidecursor.zip schemas/gschemas.compiled
