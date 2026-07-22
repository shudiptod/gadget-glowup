type ApiRequestConfig = Omit<RequestInit, "method" | "body"> & {
  body?: BodyInit | null | unknown;
  params?: Record<string, unknown>;
};

const API_BASE_URL = (process.env.NODE_ENV === "production" ?
  process.env.NEXT_PUBLIC_API_URL : "http://localhost:5001/api") ||
  (typeof window === "undefined" ? "http://localhost:5001" : "");

function buildUrl(url: string, params?: Record<string, unknown>) {
  const normalizedUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

  if (!params) {
    return normalizedUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query
    ? `${normalizedUrl}${normalizedUrl.includes("?") ? "&" : "?"}${query}`
    : normalizedUrl;
}

async function request<T>(url: string, init: ApiRequestConfig & { method: string }) {
  const { params, headers, body, ...rest } = init;
  const requestUrl = buildUrl(url, params);
  const isFormData = body instanceof FormData;

  const response = await fetch(requestUrl, {
    credentials: "include",
    ...rest,
    method: init.method,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

    const error = new Error(
      (payload as { message?: string })?.message ?? `Request failed with status ${response.status}`,
    ) as Error & {
      status?: number;
      response?: { status: number; data?: unknown };
    };

    error.status = response.status;
    error.response = { status: response.status, data: payload };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

const apiClient = {
  get: <T>(url: string, config?: ApiRequestConfig) => request<T>(url, { ...config, method: "GET" }),
  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>(url, { ...config, method: "POST", body: data }),
  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>(url, { ...config, method: "PUT", body: data }),
  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    request<T>(url, { ...config, method: "PATCH", body: data }),
  delete: <T>(url: string, config?: ApiRequestConfig) =>
    request<T>(url, { ...config, method: "DELETE" }),
};

export default apiClient;
