const ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg"
]);

function getExtension(url) {
  const clean = url.split("?")[0].split("#")[0];
  return clean.slice(clean.lastIndexOf(".")).toLowerCase();
}

export async function resolve(specifier, context, nextResolve) {
  const resolved = await nextResolve(specifier, context);
  const extension = getExtension(resolved.url);

  if (ASSET_EXTENSIONS.has(extension)) {
    return { ...resolved, format: "module", shortCircuit: true };
  }

  return resolved;
}

export async function load(url, context, nextLoad) {
  const extension = getExtension(url);
  if (ASSET_EXTENSIONS.has(extension)) {
    return {
      format: "module",
      shortCircuit: true,
      source: `export default ${JSON.stringify(url)};`
    };
  }
  return nextLoad(url, context);
}
