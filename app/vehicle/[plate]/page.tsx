import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Home, Car } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleInfo from "@/components/vehicle/VehicleInfo";
import LegalStatus from "@/components/vehicle/LegalStatus";
import TheftStatus from "@/components/vehicle/TheftStatus";
import OwnershipHistory from "@/components/vehicle/OwnershipHistory";
import ViolationsList from "@/components/vehicle/ViolationsList";

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engineType: string;
  vin: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  status: string;
  ownerships: any[];
  maintenances: any[];
  violations: any[];
  theftReports: any[];
}

async function getVehicle(plate: string): Promise<Vehicle | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/vehicle/${encodeURIComponent(plate)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ plate: string }> }) {
  const { plate } = await params;
  const vehicle = await getVehicle(plate);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar />

      {/* شريط التنقل (Breadcrumb) */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>

            <ChevronLeft className="w-4 h-4 text-muted-foreground" />

            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
            >
              <Car className="w-4 h-4" />
              تفاصيل المركبة
            </Link>

            <ChevronLeft className="w-4 h-4 text-muted-foreground" />

            <span className="text-foreground font-semibold">
              {vehicle.plateNumber}
            </span>
          </nav>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* الصف الأول - رقم اللوحة */}
          <VehicleHeader
            plateNumber={vehicle.plateNumber}
            status={vehicle.status}
          />

          {/* الصف الثاني - الحالة القانونية + بيانات السيارة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LegalStatus
              insuranceExpiry={vehicle.insuranceExpiry}
              registrationExpiry={vehicle.registrationExpiry}
            />
            <VehicleInfo
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
              color={vehicle.color}
              engineType={vehicle.engineType}
              vin={vehicle.vin}
            />
          </div>

          {/* الصف الثالث - بلاغ السرقة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TheftStatus theftReports={vehicle.theftReports} />
          </div>

          {/* الصف الرابع - سجل الملكية + المخالفات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OwnershipHistory ownerships={vehicle.ownerships} />
            <ViolationsList violations={vehicle.violations} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}