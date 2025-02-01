import { BASE_API_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookieHelper";
import { IRecommendation } from "@/pages/listProperty/components/PropertyForm";

export const propertyRepository = {
  async fetchAllProperties() {
    try {
      const response = await fetch(`${BASE_API_URL}/property/?as=all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("ERROR WHILE FETCHING DATA ", errorData);
        throw new Error(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error(error);
      throw new Error("Error fetching properties.");
    }
  },

  async fetchSelfProperty() {
    try {
      const response = await fetch(`${BASE_API_URL}/property/?as=self`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
      }

      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      console.error("ERROR FETCHING USER's properties" + err);
      throw new Error("Error Fetching property");
    }
  },

  async fetchProperty(id: number) {
    try {
      const response = await fetch(`${BASE_API_URL}/property/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("error while fetching property : ", err);
      throw new Error("Error fetching property");
    }
  },

  async listProperty(data: any) {
    console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "uploaded_images") {
        if (data[key] && typeof data[key] === "object") {
          Object.keys(data[key]).forEach((fileIndex) => {
            if (data[key][fileIndex] instanceof File) {
              formData.append(
                `uploaded_images[${fileIndex}]`,
                data[key][fileIndex]
              );
            }
          });
        }
      } else if (key === "thumbnail" && data[key] instanceof File) {
        formData.append("thumbnail", data[key]);
      } else if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        !(data[key] instanceof File)
      ) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await fetch(`${BASE_API_URL}/property/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData);
      }

      const result = await response.json();

      console.log(result);
    } catch (err: any) {
      console.log(err);
      throw new Error("Error listing property");
    }
  },

  async deleteProperty(id: number) {
    try {
      const response = await fetch(`${BASE_API_URL}/property/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
      }
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting property");
    }
  },

  async updateProperty(propertyId: number, data: any) {
    console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "uploaded_images") {
        if (data[key] && typeof data[key] === "object") {
          Object.keys(data[key]).forEach((fileIndex) => {
            if (data[key][fileIndex] instanceof File) {
              formData.append(
                `uploaded_images[${fileIndex}]`,
                data[key][fileIndex]
              );
            }
          });
        }
      } else if (key === "thumbnail" && data[key] instanceof File) {
        formData.append("thumbnail", data[key]);
      } else if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        !(data[key] instanceof File)
      ) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    try {
      const res = await fetch(`${BASE_API_URL}/property/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
    } catch (err: any) {
      return new Error("Error updating property");
    }
  },

  async getPriceRecommendation(data: IRecommendation) {
    try {
      const res = await fetch(`${BASE_API_URL}/recommendation/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }

      const result = await res.json();
      return result;
    } catch (err: any) {
      throw new Error("Failed to get recommendation" + err);
    }
  },
};
