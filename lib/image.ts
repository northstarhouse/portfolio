export function optimizeImageUrl(src: string, width: number, quality = 75): string {
  if (!src) return src;

  const match = src.match(
    /^(https:\/\/[^/]+\.supabase\.co)\/storage\/v1\/object\/public\/(.+)$/
  );

  if (!match) return src;

  const [, host, path] = match;
  return `${host}/storage/v1/render/image/public/${path}?width=${width}&quality=${quality}&resize=cover`;
}
