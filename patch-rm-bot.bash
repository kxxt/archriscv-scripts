#!/bin/bash

set -ex

pkgs=$(rg -l "autoreconf" | xargs dirname  -- )

while IFS= read -r line; do
	(cd ../packages && bash ./build-vanilla.bash "$line") && rm -r "$line"
	echo "$line can be built from patch. Press enter to continue..."
	read
done < <(echo "$pkgs" | sed "/\./d")
