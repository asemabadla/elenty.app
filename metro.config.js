const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolveRequest } = config.resolver;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    // Force resolving to the CJS version on web.
    let target = moduleName;
    if (moduleName === 'zustand') {
      target = 'zustand/index.js';
    } else if (!moduleName.endsWith('.js')) {
      target = `${moduleName}.js`;
    }
    return context.resolveRequest(context, target, platform);
  }
  
  // Default resolution
  return resolveRequest
    ? resolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
