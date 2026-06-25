import TheftReportForm from "@/components/report/TheftReportForm"
import Footer from "@/components/ui/Footer"
import Navbar from "@/components/ui/Navbar"

export default function ReportTheftPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      {/* تم إضافة px-4 لحماية الحواف في الموبايل و flex-1 لضمان نزول الفوتر لأسفل الشاشة */}
      <div className="max-w-2xl w-full mx-auto my-6 px-4 flex-1">
        <TheftReportForm />
      </div>
      <Footer />
    </div>
  )
}