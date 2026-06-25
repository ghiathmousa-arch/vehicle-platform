// بيانات السيارة
import { Car } from "lucide-react";

interface Props {
  brand: string;
  model: string;
  year: number;
  color: string;
  engineType: string;
  vin: string;
}

export default function VehicleInfo({ brand, model, year, color, engineType, vin }: Props) {
  const infoItems = [
    { label: "الماركة", value: brand },
    { label: "الموديل", value: model },
    { label: "السنة", value: year.toString() },
    { label: "اللون", value: color },
    { label: "المحرك", value: engineType },
    { label: "رقم الهيكل (VIN)", value: vin },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Car className="w-6 h-6 text-primary" />
        بيانات السيارة
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="text-right">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-foreground font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}