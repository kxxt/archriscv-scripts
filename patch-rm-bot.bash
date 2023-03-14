#!/bin/bash

set -ex

pkgs=$(rg -l "autoreconf" | xargs dirname  -- )
while IFS= read -r line <&3; do
	if grep -q "$line" ignore-list; then
		echo "Ignoring $line"
		continue
	fi
	
	if (cd ../packages && bash ./build-vanilla.bash "$line") && rm -r "$line"; 
	then
		echo "$line can be built without patch."
	else
		echo "$line can't be built without patch."
	fi
	read -p "Press <ENTER> to continue..."
done 3< <(echo "$pkgs" | sed "/\./d")
