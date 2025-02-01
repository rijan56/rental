import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgreementsRepository } from "@/core/repositories/agreementsRepository";
import { toast } from "sonner";
import { Calendar, Users, Expand, DollarSign } from "lucide-react";
import { Property } from "@/pages/properties/page";
import { useNavigate } from "react-router";

const AgreementCard = ({
  propertyData,
  agreementData,
}: {
  propertyData: Property;
  agreementData: any;
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  type AgreementStatus = "APPLIED" | "ACCEPTED" | "REJECTED" | "PENDING";

  const getStatusColor = (status: string) => {
    const statusColors = {
      APPLIED: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      DEFAULT: "bg-gray-100 text-gray-800",
    };
    const normalizedStatus = status.toUpperCase() as AgreementStatus;
    return statusColors[normalizedStatus] || "bg-gray-100 text-gray-800";
  };

  const handleAccept = async (agreementId: number) => {
    try {
      await AgreementsRepository.setAgreementVerdict(agreementId, "ACCEPTED");
      toast.success("Agreement Accepted", {
        description: "The agreement has been successfully accepted.",
        duration: 3000,
      });
      navigate("/agreements");
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Something went wrong while accepting.",
        duration: 1000,
      });
    }
  };

  const handleReject = async (agreementId: number) => {
    try {
      await AgreementsRepository.setAgreementVerdict(agreementId, "REJECTED");
      toast.success("Agreement Rejected", {
        description: "The agreement has been declined.",
        duration: 3000,
      });
      navigate("/agreements");
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Something went wrong while rejecting.",
        duration: 1000,
      });
    }
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={`http://localhost:8000${propertyData?.thumbnail}`}
          alt={propertyData?.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {propertyData?.type}
          </span>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {propertyData?.title}
          </h2>
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-lg">{propertyData?.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-y py-4 border-gray-200">
          <div className="flex items-center gap-2">
            <Expand className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">
              {propertyData?.area} ft²
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">
              {propertyData?.bedrooms_count} Bed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">
              {propertyData?.can_accommodate} Guests
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                {formatDate(agreementData?.start_date)}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                agreementData?.status
              )}`}
            >
              {agreementData?.status}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Agreement Details
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Message:</strong> {agreementData?.message}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Bid Amount:</strong> ${agreementData?.amount}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={() => handleAccept(agreementData?.id)}
            className="flex-1 bg-green-500 hover:bg-green-600 transition-colors"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleReject(agreementData?.id)}
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700 transition-colors"
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgreementCard;
