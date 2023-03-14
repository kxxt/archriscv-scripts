#!/bin/bash

set -ex

pkgs=$(rg -l "autoreconf" | xargs dirname  -- )

while IFS= read -r line; do
	if grep -q "$line" ignore-list; then
		echo "Ignoring $line"
		continue
	fi
	
	if (cd ../packages && bash ./build-vanilla.bash "$line") && rm -r "$line"; 
	then
		echo "$line can be built from patch."
	else
		echo "$line can't be built from patch."
	fi
	read -r
done < <(echo "$pkgs" | sed "/\./d")
