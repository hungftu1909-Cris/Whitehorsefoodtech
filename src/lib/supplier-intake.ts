/** Only expose an explicitly configured public HTTPS template URL. */
export function publicSupplierTemplateUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      host === "localhost" ||
      host.endsWith(".local")
    ) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}
