import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ComplaintsRepository } from "@/core/repositories/complaintsRepository";
import { toast } from "sonner";
import { useAuth } from "@/core/context/authContext";

const ComplaintsCard = ({ data }: { data: any }) => {
  const { user } = useAuth();
  const handleResolve = async (complaintId: number) => {
    try {
      await ComplaintsRepository.updateComplaint(complaintId);
      toast("Complaint Resolved successfully");
    } catch (err) {
      toast("Error while resolving complaint");
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
        <p>You don't have any complaints registered yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((complaint: any, index: number) => (
        <Card
          key={index}
          className="shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg font-bold truncate">
              {complaint.title}
            </CardTitle>
            <CardDescription>
              Agreement ID: {complaint.agreement_id}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700">{complaint.description}</p>
          </CardContent>

          {user.user.type === "landlord" && (
            <CardFooter className="flex justify-between">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleResolve(complaint.id)}
              >
                Resolve
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ComplaintsCard;
