import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DropZone from "./DropZone";
import { propertyRepository } from "@/core/repositories/propertyRepository";
import { BASE_MEDIA_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export interface IProperty {
  address: string;
  owner: string;
  title: string;
  description: string;
  type: string;
  location: string;
  price: number;
  area: number;
  bedrooms_count: number;
  bathrooms_count: number;
  can_accomodate: number;
  year_built?: number;
  parking_spaces?: number;
  uploaded_images: [];
  thumbnail: File | null;
}

export interface IRecommendation {
  land_area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  city: string;
  district: string;
  car_parking: number;
  staying: number;
}

const PropertyForm = ({ propertyId }: { propertyId?: number }) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [propertyImages, setPropertyImages] = useState<any[]>([]);
  const [thumbnailError, setThumbnailError] = useState<string>("");
  const [priceRecommendation, setPriceRecommendation] = useState<
    number | null
  >();

  const {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IProperty>();

  const navigate = useNavigate();
  const watchFields = watch();

  const getRecommendedPrice = async (data: IRecommendation) => {
    try {
      const res = await propertyRepository.getPriceRecommendation(data);
      console.log(res.predicted_price);
      setPriceRecommendation(res.predicted_price);
    } catch (err: any) {
      console.error(err);
    }
  };

  const recommendation = useMemo(() => {
    return {
      land_area: watchFields.area,
      bedrooms: watchFields.bedrooms_count,
      bathrooms: watchFields.bathrooms_count,
      floors: 1,
      city: watchFields.location,
      district: watchFields.address,
      car_parking: watchFields.parking_spaces || 0,
      staying: 1,
    };
  }, [
    watchFields.area,
    watchFields.bedrooms_count,
    watchFields.bathrooms_count,
    watchFields.location,
    watchFields.address,
    watchFields.parking_spaces,
  ]);

  useEffect(() => {
    if (
      recommendation.land_area &&
      recommendation.bedrooms &&
      recommendation.bathrooms &&
      recommendation.district &&
      recommendation.city &&
      recommendation.car_parking !== undefined
    ) {
      getRecommendedPrice(recommendation);
    }
  }, [recommendation]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        const result = await propertyRepository.fetchProperty(propertyId);
        setValue("title", result.title);
        setValue("description", result.description);
        setValue("type", result.type);
        setValue("address", result.address);
        setValue("location", result.location);
        setValue("price", result.price);
        setValue("area", result.area);
        setValue("bedrooms_count", result.bedrooms_count);
        setValue("bathrooms_count", result.bathrooms_count);
        setValue("can_accomodate", result.can_accomodate);

        if (result.facts) {
          setValue("parking_spaces", result.facts.parking_spaces);
          setValue("year_built", result.facts.year_built);
        }
        if (result.thumbnail) {
          setThumbnailUrl(result.thumbnail);
        }
        if (result.images && result.images.length > 0) {
          setPropertyImages(result.images);
        }
      }
    };

    if (propertyId) {
      setEditMode(true);
      fetchProperty();
    }
  }, [propertyId, setValue]);

  const handleFileSelect = (file: File) => {
    setThumbnailFile(file);
    setValue("thumbnail", file);
    setThumbnailError("");
  };

  const formatData = (data: IProperty) => {
    const { parking_spaces, year_built, ...remainingData } = data;
    const formattedData = {
      ...remainingData,
      facts: { parking_spaces, year_built },
    };
    return formattedData;
  };

  const onSubmit = async (data: IProperty) => {
    if (editMode && !thumbnailFile) {
      setThumbnailError("A new thumnail image is required before updating.");
      return;
    }

    try {
      data.thumbnail = thumbnailFile;

      const formData = formatData(data);
      console.log("Submitting data:", formData);

      if (editMode) {
        const result = await propertyRepository.updateProperty(
          propertyId!,
          formData
        );
        if (result instanceof Error) {
          throw result;
        }
        toast("Property updated successfully");
        navigate("/myproperty");
      } else {
        const result = propertyRepository.listProperty(formData);
        if (result instanceof Error) {
          throw result;
        }
        toast("Property Listed successfully");
        navigate("/myproperty");
      }
    } catch (err) {
      toast("ERROR WHILE SUBMITTING");
      console.error("Form submission error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2  gap-4 space-between"
    >
      <div className="col-span-1 space-y-2">
        <Label>Title</Label>
        <Input type="text" {...register("title")} />
        <Label>Description</Label>
        <Input type="text" {...register("description")} />
        <Label>Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <select
              onChange={field.onChange}
              defaultValue={"HOUSE"}
              className="w-full p-2 rounded-lg border-1"
            >
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
            </select>
          )}
        />{" "}
        <Label>Address</Label>
        <Input type="text" {...register("address")} />
        <Label className="mb-2">Location</Label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <select
              onChange={field.onChange}
              defaultValue={"KATHMANDU"}
              className="w-full p-2 rounded-lg border-1"
            >
              <option value="KATHMANDU">Kathmandu</option>
              <option value="BHAKTAPUR">Bhaktapur</option>
              <option value="LALITPUR">Lalitpur</option>
            </select>
          )}
        />
        <Label>Thumbnail {editMode && "(New thumbnail required)"}</Label>
        {editMode && thumbnailUrl && (
          <div className="mb-2">
            <p className="text-sm mb-1">Current thumbnail:</p>
            <img
              src={`${BASE_MEDIA_URL}${thumbnailUrl}`}
              alt="Current thumbnail"
              className="h-32 object-cover rounded-md"
            />
          </div>
        )}
        <DropZone Title="Thumbnail Image" onFileSelected={handleFileSelect} />
        {thumbnailError && (
          <p className="text-red-500 text-sm mt-1">{thumbnailError}</p>
        )}
        <Label>Property Images</Label>
        {editMode && propertyImages.length > 0 && (
          <div className="mb-2">
            <p className="text-sm mb-1">Current images:</p>
            <div className="flex flex-wrap gap-2">
              {propertyImages.map((image) => (
                <img
                  key={image.id}
                  src={`${BASE_MEDIA_URL}${image.file}`}
                  alt={`Property image ${image.id}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
        <Input type="file" multiple {...register("uploaded_images")} />
      </div>
      <div className="col-span-1 space-y-2">
        <Label>Price</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />

        <Label>Area</Label>
        <Input type="number" {...register("area", { valueAsNumber: true })} />

        <Label>Bedrooms count</Label>
        <Input
          type="number"
          {...register("bedrooms_count", { valueAsNumber: true })}
        />

        <Label>Bathrooms count</Label>
        <Input
          type="number"
          {...register("bathrooms_count", { valueAsNumber: true })}
        />

        <Label>Can Accomodate</Label>
        <Input
          type="number"
          {...register("can_accomodate", { valueAsNumber: true })}
        />

        <Label>Year Built</Label>
        <Input
          type="number"
          {...register("year_built", { valueAsNumber: true })}
        />

        <Label>Parking Spaces</Label>
        <Input
          type="number"
          {...register("parking_spaces", { valueAsNumber: true })}
        />
        {priceRecommendation ? (
          <div className="font-bold text-xl">
            <p>
              Recommended Price :{" "}
              <span className="text-violet-600">
                {priceRecommendation}
                {"k"}
              </span>
            </p>
          </div>
        ) : (
          <div className="font-bold text-xl">
            Please enter all fields before receiving price recommendation
          </div>
        )}
      </div>

      <Button disabled={isSubmitting} type="submit" className="col-span-2">
        {editMode ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
};

export default PropertyForm;
