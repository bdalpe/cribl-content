#!/bin/bash
mkdir build
for folder in ./functions/*; do
  f="${folder##*/}"
  mkdir build/"$f"
  TOP=("LICENSE.md" "README.md")
  FUNCT=("conf.schema.json" "conf.ui-schema.json" "index.js" "package.json" "package-lock.json")
  echo '{"version":"0.0.1","displayName":"'$f'","author":"Brendan Dalpe - Cribl","name":"'$f'"}' > build/"$f"/package.json

  for i in ${TOP[*]}; do
    if [[ -f  ./functions/"$f"/"$i" ]]; then
      cp ./functions/"$f"/"$i" build/"$f"/"$i"
    fi
  done

  mkdir -p build/"$f"/default/functions/"$f"

  for i in ${FUNCT[*]}; do
    if [[ -f  ./functions/"$f"/"$i" ]]; then
      cp ./functions/"$f"/"$i" build/"$f"/default/functions/"$f"
    fi
  done

  if [[ -f build/"$f"/default/functions/"$f"/package.json ]]; then
    ( cd build/"$f"/default/functions/"$f"/ && npm install )
  fi

  tar czvf build/"$f.crbl" -C build/"$f" .
  rm -rf build/"$f"
done