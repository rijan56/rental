import Sidebar from "@/core/presentation/components/Sidebar";
import { propertyRepository } from "@/core/repositories/propertyRepository";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Property } from "../properties/page";
import { BASE_MEDIA_URL } from "@/lib/constants";
import { useAuth } from "@/core/context/authContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { AgreementsRepository } from "@/core/repositories/agreementsRepository";

const PropertyPage = () => {
  const [propertyData, setPropertyData] = useState<Property>();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchProperties = async () => {
      const result = await propertyRepository.fetchProperty(Number(id));
      setPropertyData(result);
      console.log(result);
    };

    if (id) fetchProperties();
  }, [id]);
  if (!propertyData) return <p className="text-center mt-10">Loading...</p>;

  const onSubmit = async (data: any) => {
    try {
      await AgreementsRepository.sendAgreement(data, Number(id));
      toast("Successfully submitted the agreement");
    } catch (err: any) {
      toast("Error while submitting agreement");
    }
  };

  const handleEdit = () => {
    navigate(`/listproperty/?edit=${id}`);
  };
  // const handleAgreement = () => {
  //   navigate(`/agreements/?edit=${id}`);
  // };
  const handleDelete = async () => {
    try {
      const result = await propertyRepository.deleteProperty(propertyData.id);
      console.log(result);

      toast(" Property Deleted successfully");
      navigate("/myproperty");
    } catch (err) {
      toast("Could not delete property");
    }
  };
  return (
    <div className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="flex-grow p-6">
        <Card className="p-6 shadow-lg max-w-4xl mx-auto">
          {user?.user.type === "landlord" ? (
            <div className="flex gap-4 justify-end ">
              <Button
                className="bg-blue-500 hover:bg-blue-800"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-800"
                onClick={handleDelete}
              >
                Delete
              </Button>
              {/* <Button
                onClick={() => handleAgreement()}
                className="bg-amber-400 hover:bg-amber-500"
              >
                View Agreements
              </Button> */}
            </div>
          ) : (
            <div className="flex gap-4 justify-end ">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-400 hover:bg-amber-500">
                    Send Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Send Rental Proposal</DialogTitle>
                    <DialogDescription>
                      Enter the rental details below. Click send when you're
                      ready.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            className={`w-full ${
                              errors.amount
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            {...register("amount", { required: true })}
                          />
                          {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">
                              Amount is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-date" className="text-right">
                          Start Date
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="start-date"
                            type="date"
                            className={`w-full ${
                              errors.start_date
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            {...register("start_date", { required: true })}
                          />
                          {errors.start_date && (
                            <p className="text-red-500 text-sm mt-1">
                              Start date is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-date" className="text-right">
                          End Date
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="end-date"
                            type="date"
                            className={`w-full ${
                              errors.end_date
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            {...register("end_date", { required: true })}
                          />
                          {errors.end_date && (
                            <p className="text-red-500 text-sm mt-1">
                              End date is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid items-center gap-4">
                        <Label htmlFor="message" className="text-left">
                          Message
                        </Label>
                        <div>
                          <Textarea
                            id="message"
                            placeholder="Enter additional details or special requests..."
                            className={`w-full ${
                              errors.message
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            {...register("message", { required: true })}
                          />
                          {errors.message && (
                            <p className="text-red-500 text-sm mt-1">
                              Message is required
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {isSubmitting ? "Submitting Proposal" : "Send Proposal"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/2 h-64">
              <img
                src={`${BASE_MEDIA_URL}${propertyData.thumbnail}`}
                alt={propertyData.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{propertyData.title}</h1>
              <p className="text-gray-600 mt-2">{propertyData.description}</p>
              <p className="mt-4 font-semibold">Type: {propertyData.type}</p>
              <p>Location: {propertyData.location}</p>
              <p>Address: {propertyData.address}</p>
              <p className="text-lg font-bold mt-4">
                ${propertyData.price} / month
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Area</p>
              <p>{propertyData.area} sqft</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Bedrooms</p>
              <p>{propertyData.bedrooms_count}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Bathrooms</p>
              <p>{propertyData.bathrooms_count}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Can Accommodate</p>
              <p>{propertyData.can_accommodate} people</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Additional Facts</h2>
            <p>Parking Spaces: {propertyData.facts.parking_spaces}</p>
            <p>Year Built: {propertyData.facts.year_built}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {propertyData.images.map((image) => (
                <div key={image.id} className="relative w-full h-40">
                  <img
                    src={`${BASE_MEDIA_URL}${image.file}`}
                    alt="Property Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PropertyPage;
