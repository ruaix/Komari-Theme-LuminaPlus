import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Clock3,
  Cpu,
  Database,
  Download,
  HardDrive,
  LogIn,
  LogOut,
  MemoryStick,
  Network,
  RefreshCw,
  ShieldAlert,
  Upload,
  type LucideIcon,
} from "lucide-react";

export type PixelMetricIconKind =
  | "cpu"
  | "memory"
  | "disk"
  | "load"
  | "upload"
  | "download"
  | "outbound"
  | "inbound"
  | "quota"
  | "latency"
  | "loss"
  | "online"
  | "expiry"
  | "price"
  | "connections";

const FALLBACK_ICONS: Record<PixelMetricIconKind, LucideIcon> = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
  load: ChartNoAxesColumnIncreasing,
  upload: Upload,
  download: Download,
  outbound: LogOut,
  inbound: LogIn,
  quota: Database,
  latency: Clock3,
  loss: ShieldAlert,
  online: RefreshCw,
  expiry: CalendarDays,
  price: CircleDollarSign,
  connections: Network,
};

export function PixelMetricIcon({
  kind,
  size = 14,
}: {
  kind: PixelMetricIconKind;
  size?: number;
}) {
  const FallbackIcon = FALLBACK_ICONS[kind];
  return (
    <span
      className={`themed-metric-icon themed-metric-icon--${kind}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <FallbackIcon
        className="themed-metric-icon-fallback"
        width={size}
        height={size}
        strokeWidth={2}
      />
      <svg
        className={`pixel-metric-icon pixel-metric-icon--${kind}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        shapeRendering="crispEdges"
      >
      {kind === "cpu" && (
        <>
          <path className="px-outline" d="M3 0h2v2h2V0h2v2h2V0h2v2h2v3h-2v2h2v2h-2v2h2v3h-2v2h-2v-2H9v2H7v-2H5v2H3v-2H1v-3h2V9H1V7h2V5H1V2h2V0Z" />
          <path className="px-main" d="M4 3h8v10H4V3Z" />
          <path className="px-light" d="M5 4h6v2H5V4Z" />
          <path className="px-detail" d="M6 6h5v5H6V6Zm1 1v3h3V7H7Z" fillRule="evenodd" />
        </>
      )}
      {kind === "memory" && (
        <>
          <path className="px-outline" d="M1 2h14v11h-2v2h-2v-2H9v2H7v-2H5v2H3v-2H1V2Z" />
          <path className="px-main" d="M3 4h10v7H3V4Z" />
          <path className="px-light" d="M4 5h8v1H4V5Z" />
          <path className="px-detail" d="M4 7h2v3H4V7Zm3 0h2v3H7V7Zm3 0h2v3h-2V7Z" />
        </>
      )}
      {kind === "disk" && (
        <>
          <path className="px-outline" d="M2 1h12v14H2V1Z" />
          <path className="px-main" d="M4 3h8v6H4V3Zm0 8h8v2H4v-2Z" />
          <path className="px-light" d="M5 4h6v1H5V4Z" />
          <path className="px-detail" d="M9 6h2v2H9V6Zm-4 6h4v1H5v-1Z" />
        </>
      )}
      {kind === "load" && (
        <>
          <path className="px-outline" d="M1 13h14v2H1v-2ZM2 8h3v5H2V8Zm4-4h3v9H6V4Zm4 2h3v7h-3V6Zm4-5h2v12h-2V1Z" />
          <path className="px-main" d="M3 9h1v3H3V9Zm4-4h1v7H7V5Zm4 2h1v5h-1V7Zm4-5h1v10h-1V2Z" />
          <path className="px-light" d="M3 9h1v1H3V9Zm4-4h1v1H7V5Zm4 2h1v1h-1V7Zm4-5h1v1h-1V2Z" />
        </>
      )}
      {kind === "upload" && (
        <>
          <path className="px-outline" d="M6 1h4v2h2v2h2v4h-4v4h3v3H3v-3h3V9H2V5h2V3h2V1Z" />
          <path className="px-main" d="M7 3h2v2h2v2H9v6H7V7H5V5h2V3Zm-2 11h6v1H5v-1Z" />
          <path className="px-light" d="M7 3h1v8H7V3Z" />
        </>
      )}
      {kind === "download" && (
        <>
          <path className="px-outline" d="M6 0h4v7h4v4h-2v2h-2v2H6v-2H4v-2H2V7h4V0Zm-3 14h10v2H3v-2Z" />
          <path className="px-main" d="M7 2h2v7h2v1H9v2H7v-2H5V9h2V2Zm-2 13h6v1H5v-1Z" />
          <path className="px-light" d="M7 2h1v8H7V2Z" />
        </>
      )}
      {(kind === "outbound" || kind === "inbound") && (
        <>
          <path className="px-outline" d="M5 0h6v2h3v3h2v6h-2v3h-3v2H5v-2H2v-3H0V5h2V2h3V0Z" />
          <path className="px-main" d="M5 2h6v2h2v3H3V4h2V2Zm-2 7h10v3h-2v2H5v-2H3V9Z" />
          <path className="px-light" d="M4 4h4v2H4V4Z" />
          <path className="px-detail" d={kind === "outbound" ? "M7 3h3v2h2v2h-2V6H8v4H6V6H4V5h3V3Z" : "M6 3h2v4h2V6h2v1h-2v2H8v2H6V9H4V7h2V3Z"} />
        </>
      )}
      {kind === "quota" && (
        <>
          <path className="px-outline" d="M2 1h12v14H2V1Z" />
          <path className="px-main" d="M4 3h8v10H4V3Z" />
          <path className="px-light" d="M5 4h6v2H5V4Z" />
          <path className="px-detail" d="M5 8h6v1H5V8Zm0 3h4v1H5v-1Z" />
          <path className="px-accent" d="M10 10h2v3h-2v-3Z" />
        </>
      )}
      {kind === "latency" && (
        <>
          <path className="px-outline" d="M5 0h6v2h2v2h2v9h-2v2H3v-2H1V4h2V2h2V0Z" />
          <path className="px-main" d="M5 3h6v2h2v7h-2v1H5v-1H3V5h2V3Z" />
          <path className="px-light" d="M5 4h5v1H5V4Z" />
          <path className="px-detail" d="M7 5h2v4h3v2H7V5Z" />
        </>
      )}
      {kind === "loss" && (
        <>
          <path className="px-outline" d="M6 0h4v2h3v2h2v8h-2v2h-3v2H6v-2H3v-2H1V4h2V2h3V0Z" />
          <path className="px-main" d="M6 3h4v1h2v2h1v5h-2v2H5v-2H3V6h1V4h2V3Z" />
          <path className="px-light" d="M5 4h5v1H5V4Z" />
          <path className="px-detail" d="M7 5h2v5H7V5Zm0 7h2v2H7v-2Z" />
        </>
      )}
      {kind === "online" && (
        <>
          <path className="px-outline" d="M6 0h4v2h2v2h2v2h2v4h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V6h2V4h2V2h2V0Z" />
          <path className="px-main" d="M6 3h4v2h2v2h2v2h-3v2H9v2H6v-2H4V9H2V7h2V5h2V3Z" />
          <path className="px-light" d="M5 5h4v2H5V5Z" />
          <path className="px-detail" d="M7 7h2v4h3v2H7V7Z" />
        </>
      )}
      {kind === "expiry" && (
        <>
          <path className="px-outline" d="M3 1h2V0h2v2h2V0h2v1h2v2h2v12H1V3h2V1Z" />
          <path className="px-main" d="M3 4h10v9H3V4Z" />
          <path className="px-light" d="M4 5h8v2H4V5Z" />
          <path className="px-detail" d="M5 8h2v2H5V8Zm4 0h2v2H9V8Zm-4 3h2v1H5v-1Z" />
          <path className="px-accent" d="M9 11h3v2H9v-2Z" />
        </>
      )}
      {kind === "price" && (
        <>
          <path className="px-outline" d="M5 0h6v2h3v3h2v6h-2v3h-3v2H5v-2H2v-3H0V5h2V2h3V0Z" />
          <path className="px-main" d="M5 2h6v2h2v2h1v4h-1v2h-2v2H5v-2H3v-2H2V6h1V4h2V2Z" />
          <path className="px-light" d="M4 4h6v2H4V4Z" />
          <path className="px-detail" d="M5 5h2l1 2 1-2h2L9 9v3H7V9L5 5Z" />
        </>
      )}
      {kind === "connections" && (
        <>
          <path className="px-outline" d="M1 1h6v6H5v2h6V7H9V1h6v6h-2v2h2v6H9v-4H7v4H1V9h2V7H1V1Z" />
          <path className="px-main" d="M3 3h2v2H3V3Zm8 0h2v2h-2V3ZM3 11h2v2H3v-2Zm8 0h2v2h-2v-2Z" />
          <path className="px-light" d="M3 3h1v1H3V3Zm8 0h1v1h-1V3Z" />
          <path className="px-detail" d="M6 7h4v4H6V7Z" />
        </>
      )}
      </svg>
    </span>
  );
}
