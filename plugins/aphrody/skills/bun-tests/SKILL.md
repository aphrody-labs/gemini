---
name: bun-tests
description: "Write and run tests in the Aphrody runtime (aphrody-labs/bun): `bun bd test <file>`, where a test goes (test/js, test/cli, test/bundler, regression), the harness (bunExe, bunEnv, tempDir, normalizeBunSnapshot...), CI runner and review rules."
---

# Testing the Aphrody runtime

## Exports of test/harness.ts

`BREAKING_CHANGES_BUN_1_2`, `BunRunResult`, `DirectoryTree`, `Elf64ProgramHeader`, `MAX_PATH_BYTES`, `assertManifestsPopulated`, `blackholePortSource`, `bunEnv`, `bunEnvWithoutTerminal`, `bunExe`, `bunRun`, `bunRunAsScript`, `bunTest`, `canBuildNodeAddons`, `compileFixture`, `cwdScope`, `describeWithContainer`, `disableAggressiveGCScope`, `dockerExe`, `dtUnknownReaddir`, `dumpStats`, `emptyProcessMaxRSS`, `exampleHtml`, `exampleSite`, `expectMaxObjectTypeCount`, `expectRssDeltaBelow`, `expiredTls`, `fakeNodeRun`, `fileDescriptorLeakChecker`, `fillRepeating`, `forEachLine`, `forceGuardMalloc`, `gc`, `gcTick`, `getFDCount`, `getGlibcVersion`, `getMacOSVersion`, `getMaxFD`, `getPuppeteerInstallEnv`, `getSecret`, `githubTarball`, `gunzipJsonRequest`, `hideFromStackTrace`, `hostedGitRepository`, `integersThatNeedRounding`, `invalidTls`, `isASAN`, `isAndroid`, `isArm64`, `isBroken`, `isBuildKite`, `isCI`, `isDebug`, `isDockerEnabled`, `isFlaky`, `isFreeBSD`, `isGlibc`, `isGlibcVersionAtLeast`, `isIPv4`, `isIPv6`, `isIntelMacOS`, `isLinux`, `isMacOS`, `isMacOSVersionAtLeast`, `isMusl`, `isPosix`, `isRoot`, `isVerbose`, `isWindows`, `joinP`, `lazyPromiseLike`, `libcFamily`, `libcPathForDlopen`, `makeTree`, `makeTreeSync`, `makeTreeSyncFromDirectoryTree`, `mergeWindowEnvs`, `nodeExe`, `nodeExeMatchingAbi`, `nodeModulesPackages`, `normalizeBunSnapshot`, `osSlashes`, `ospath`, `pack`, `preadExact`, `randomInvalidSurrogatePair`, `randomLoneHighSurrogate`, `randomLoneLowSurrogate`, `randomLoneSurrogate`, `randomPort`, `readElf64ProgramHeaders`, `readableStreamFromArray`, `readdirSorted`, `rejectUnauthorizedScope`, `rmScope`, `rss`, `runBunInstall`, `runBunUpdate`, `runCommandMaxRSS`, `runFixtureMaxRSS`, `runWithError`, `runWithErrorPromise`, `shellExe`, `substDrive`, `tempDir`, `tempDirWithFiles`, `tempDirWithFilesAnon`, `textLockfile`, `tls`, `tmpdirSync`, `toBeValidBin`, `toBeWorkspaceLink`, `toHaveBins`, `toMatchNodeModulesAt`, `toTOMLString`, `unprivilegedSpawnOptions`, `waitForFileToExist`, `waitForPort`, `withoutAggressiveGC`, `withoutAsanQuarantine`, `writeBinCommand`, `writeShebangScript`

The full test guide of the repository is in [references/test-guide.md](references/test-guide.md).

## References

Read the one that matches the task (`references/<name>.md`):

- [bun-review-rules](references/bun-review-rules.md): Condensed checklist of what blocks Bun PRs (REVIEW.md + .claude/docs/landing-prs.md) — tests, memory safety, errors, style, compat, perf, cross-platform
- [bun-tests-harness](references/bun-tests-harness.md): test/harness.ts exports with signatures — bunExe/bunEnv, tempDir, normalizeBunSnapshot, platform flags (isWindows/isASAN/isDebug...), gc/leak helpers, VerdaccioRegistry, install helpers, matchers
- [bun-tests-layout](references/bun-tests-layout.md): Bun test/ directory layout in depth — js/node/test ported Node tests, regression, cli/install (verdaccio + dummy registry), napi, v8, @aphrody/bun-types, bake, bundler, quarantine/config files
- [bun-tests-patterns](references/bun-tests-patterns.md): How to write Bun repo tests — placement rules, spawn template, platform skip/todo idioms, snapshots, concurrency, leak/RSS test patterns, package-manager test setup with Verdaccio, anti-flake rules
- [bun-tests-runner-ci](references/bun-tests-runner-ci.md): Bun CI test runner scripts/runner.node.ts — options, test discovery, expectations.txt quarantine, platform modifiers, ASAN exception/LeakSan validation lists, flaky/parallel lists, timeouts, retries, package.json test scripts
- [bun-toolchain-bundler-tests](references/bun-toolchain-bundler-tests.md): How Bun's toolchain is tested - itBundled/expectBundled harness (test/bundler), esbuild-ported suites, transpiler/css/resolver tests, bake devTest harness (test/bake), skills writing-bundler-tests / writing-dev-server-tests
