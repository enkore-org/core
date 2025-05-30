#!/bin/bash -euf

if [[ "$RELEASE_VERSION" == vp* ]]; then
	npm publish --provenance --access public
else
	node ./.cicd/updatePackageName.mjs "@anio-software/enkore.core"
	npm publish --access public
fi
