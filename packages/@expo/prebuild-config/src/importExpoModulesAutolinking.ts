export type SearchResults = {
  [moduleName: string]: object;
};

export type SearchOptions = {
  searchPaths: string[];
  platform: 'ios' | 'android' | 'web';
  silent?: boolean;
};

type AutolinkingModule = typeof import('expo-modules-autolinking/exports');

/**
 * Imports the `expo-modules-autolinking` package installed in the project at the given path.
 */
export function importExpoModulesAutolinking(projectRoot: string): AutolinkingModule {
  const autolinking = tryRequireExpoModulesAutolinking(projectRoot);
  assertAutolinkingCompatibility(autolinking);
  return autolinking;
}

function tryRequireExpoModulesAutolinking(projectRoot: string): AutolinkingModule {
  let resolvedAutolinkingPath;
  const resolveOptions = { paths: [projectRoot] };

  try {
    resolvedAutolinkingPath = require.resolve('expo-modules-autolinking/exports', resolveOptions);
  } catch {}
  // Fallback to the older version of expo-modules-autolinking
  try {
    resolvedAutolinkingPath = require.resolve(
      'expo-modules-autolinking/build/autolinking',
      resolveOptions
    );
  } catch {}

  if (!resolvedAutolinkingPath) {
    throw new Error(
      "Cannot find 'expo-modules-autolinking' package in your project, make sure that you have 'expo' package installed"
    );
  }
  return require(resolvedAutolinkingPath);
}

function assertAutolinkingCompatibility(autolinking: AutolinkingModule): void {
  if ('resolveSearchPathsAsync' in autolinking && 'findModulesAsync' in autolinking) {
    return;
  }
  throw new Error(
    "The 'expo-modules-autolinking' package has been found, but it seems to be incompatible with '@expo/prebuild-config'"
  );
}
