// بلاغ السرقة
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface Props {
  theftReports: any[];
}

export default function TheftStatus({ theftReports }: Props) {
  const hasTheftReport = theftReports.length > 0;
  const pendingReport = theftReports.find((r) => r.status === "PENDING");
  const confirmedReport = theftReports.find((r) => r.status === "CONFIRMED");

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        {hasTheftReport ? (
          <AlertTriangle className="w-6 h-6 text-red-500" />
        ) : (
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        )}
        بلاغ السرقة
      </h2>

      {confirmedReport ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full font-semibold">
            ⚠️ مسروقة
          </span>
          <p className="text-muted-foreground text-sm mt-2">
            تاريخ البلاغ: {new Date(confirmedReport.stealDate).toLocaleDateString("ar-SA")}
          </p>
          <p className="text-muted-foreground text-sm">
            المكان: {confirmedReport.location}
          </p>
        </div>
      ) : pendingReport ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full font-semibold">
            ⏳ بلاغ قيد المراجعة
          </span>
          <p className="text-muted-foreground text-sm mt-2">
            تاريخ البلاغ: {new Date(pendingReport.stealDate).toLocaleDateString("ar-SA")}
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-semibold">
            ✓ أمنة
          </span>
          <p className="text-muted-foreground text-sm mt-2">
            لا توجد بلاغات سرقة مسجلة لهذه المركبة
          </p>
        </div>
      )}
    </div>
  );
}