import type {API} from "#~src/API.d.mts"

import {
	getProjectRootFromArgumentAndValidate,
	readEnkoreConfigFile
} from "@enkore/common"
import {initializeCore} from "#~src/internal/initializeCore.mts"
import {verifyTargetDependencyRequest} from "#~src/internal/verifyTargetDependencyRequest.mts"
import {getCurrentCoreBaseDirPath} from "#~src/internal/paths/getCurrentCoreBaseDirPath.mts"
import path from "node:path"
import type {TargetDependenciesExportObjectV0} from "#~src/internal/TargetDependenciesExportObjectV0.d.mts"

const impl : API["getInstalledTargetDependencyNames"] = async function(
	root,
	targetIdentifier
) {
	const projectRoot = await getProjectRootFromArgumentAndValidate(root)
	const projectConfig = await readEnkoreConfigFile(projectRoot)
	const coreData = await initializeCore(projectRoot, projectConfig)

	await verifyTargetDependencyRequest(projectConfig, coreData, targetIdentifier)

	const {default: dependenciesOnDisk} = await import(
		path.join(
			getCurrentCoreBaseDirPath(projectRoot),
			"dependencies",
			"index.mjs"
		)
	) as {default: TargetDependenciesExportObjectV0}

	return dependenciesOnDisk.targetDependencies.map(dependency => {
		return dependency.name
	})
}

export const getInstalledTargetDependencyNames = impl
