export function encodeTextForOverlay(text) {
  if (!text) return "";
  const base64Text = btoa(unescape(encodeURIComponent(text)));
  return encodeURIComponent(base64Text);
}

export function createTransformedUrl(originalUrl, transformationParams, caption = null) {
  if (caption) {
    const encodedCaption = encodeTextForOverlay(caption);
    const textOverlay = `l-text,ie-${encodedCaption},ly-N20,lx-20,fs-100,co-white,bg-000000A0,l-end`;
    transformationParams = textOverlay;
  }

  if (!transformationParams) return originalUrl;

  const parts = originalUrl.split("/");
  const filePath = parts.slice(4).join("/");
  const baseUrl = parts.slice(0, 4).join("/");

  return `${baseUrl}/tr:${transformationParams}/${filePath}`;
}