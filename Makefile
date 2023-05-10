vercmp.wasm vercmp.js: vercmp.c
	emcc -O2 vercmp.c -o vercmp.js -sEXPORTED_FUNCTIONS=_alpm_pkg_vercmp -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
	sed -zi 's|fetch(binaryFile|fetch("https://raw.githubusercontent.com/kxxt/archriscv-scripts/main/vercmp.wasm"|g' vercmp.js

clean:
	rm -f vercmp.wasm vercmp.js

.PHONY: clean
