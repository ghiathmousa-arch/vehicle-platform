// سجل الملكية
import { Users } from "lucide-react";

interface Ownership {
  id: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  owner: {
    name: string;
    phone: string;
  };
}

interface Props {
  ownerships: Ownership[];
}

export default function OwnershipHistory({ ownerships }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        سجل الملكية
      </h2>

      <div className="text-center mb-4">
        <span className="text-3xl font-bold text-foreground">
          {ownerships.length}
        </span>
        <span className="text-muted-foreground mr-2">مالكين سابقين</span>
      </div>

      <div className="space-y-3">
        {ownerships.map((ownership) => (
          <div
            key={ownership.id}
            className={`flex items-center justify-between p-4 rounded-xl ${ownership.isCurrent ? "bg-primary/5 border border-primary/20" : "bg-muted"
              }`}
          >
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {ownership.owner.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {ownership.owner.phone}
              </p>
            </div>
            <div className="text-left text-sm">
              <p className="text-muted-foreground">
                استلام: {new Date(ownership.startDate).toLocaleDateString("ar-SA")}
              </p>
              {ownership.endDate ? (
                <p className="text-muted-foreground">
                  تنازل: {new Date(ownership.endDate).toLocaleDateString("ar-SA")}
                </p>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  المالك الحالي
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}