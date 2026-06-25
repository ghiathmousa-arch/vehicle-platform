// رقم لوحة السيارة، وحالتها (نشطة أو غير نشطة)
import { Shield } from "lucide-react";

interface Props {
  plateNumber: string;
  status: string;
}

export default function VehicleHeader({ plateNumber, status }: Props) {
  const isActive = status === "ACTIVE";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* الأيقونة */}
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>

        {/* رقم اللوحة */}
        <div className="text-center md:text-right">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-wider">
            {plateNumber}
          </h1>
        </div>

        {/* بادج الحالة */}
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${isActive
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-red-500/10 text-red-500"
          }`}>
          {isActive ? "✓ نشطة" : "✗ غير نشطة"}
        </span>

      </div>
    </div>
  );
}