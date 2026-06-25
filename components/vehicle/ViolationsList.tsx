// قائمة المخالفات والغرامات
import { FileText, XCircle, CheckCircle } from "lucide-react";

interface Violation {
  id: string;
  type: string;
  amount: number;
  date: string;
  location: string;
  isPaid: boolean;
}

interface Props {
  violations: Violation[];
}

export default function ViolationsList({ violations }: Props) {
  const totalUnpaid = violations
    .filter((v) => !v.isPaid)
    .reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          المخالفات والغرامات
        </h2>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
          {violations.length} مخالفات
        </span>
      </div>

      {violations.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          لا توجد مخالفات مسجلة
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-muted-foreground font-medium">التاريخ</th>
                  <th className="pb-3 text-muted-foreground font-medium">نوع المخالفة</th>
                  <th className="pb-3 text-muted-foreground font-medium">المبلغ</th>
                  <th className="pb-3 text-muted-foreground font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((violation) => (
                  <tr key={violation.id} className="border-b border-border/50">
                    <td className="py-3 text-sm">
                      {new Date(violation.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-3 text-sm">{violation.type}</td>
                    <td className="py-3 text-sm font-semibold">{violation.amount} ر.س</td>
                    <td className="py-3">
                      {violation.isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" />
                          مسدد
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs">
                          <XCircle className="w-3 h-3" />
                          غير مسدد
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalUnpaid > 0 && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">إجمالي الغرامات غير المسددة:</span>
              <span className="text-xl font-bold text-primary">{totalUnpaid} ر.س</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}