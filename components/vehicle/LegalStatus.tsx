// الحالة القانونية للسيارة: التأمين والتسجيل
import { ShieldCheck, FileCheck } from "lucide-react";

interface Props {
  insuranceExpiry: string;
  registrationExpiry: string;
}

export default function LegalStatus({ insuranceExpiry, registrationExpiry }: Props) {
  const now = new Date();
  const insuranceDate = new Date(insuranceExpiry);
  const registrationDate = new Date(registrationExpiry);

  const isInsuranceValid = insuranceDate > now;
  const isRegistrationValid = registrationDate > now;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary" />
        الحالة القانونية
      </h2>

      <div className="space-y-4">
        {/* التأمين */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">التأمين</span>
          <div className="text-right">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isInsuranceValid
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
              }`}>
              {isInsuranceValid ? "✓ ساري" : "✗ منتهي"}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              ينتهي في: {formatDate(insuranceExpiry)}
            </p>
          </div>
        </div>

        {/* التسجيل */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">التسجيل</span>
          <div className="text-right">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isRegistrationValid
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
              }`}>
              {isRegistrationValid ? "✓ ساري" : "✗ منتهي"}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              ينتهي في: {formatDate(registrationExpiry)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}