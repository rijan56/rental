import { BASE_API_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookieHelper";
import { propertyRepository } from "./propertyRepository";

type HouseListing = {
  amount: number;
  end_date: string;
  start_date: string;
  message: string;
};

export const AgreementsRepository = {
  async sendAgreement(data: HouseListing, propertyId: number) {
    const formData = new FormData();
    const payload = {
      ...data,
      property_id: propertyId,
    };

    Object.keys(payload).forEach((key) => {
      const typedKey = key as keyof typeof payload;

      if (typedKey === "amount" || typedKey === "property_id") {
        formData.append(typedKey, String(Number(payload[typedKey])));
      } else {
        formData.append(typedKey, String(payload[typedKey]));
      }
    });

    try {
      const res = await fetch(`${BASE_API_URL}/agreements/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
    } catch (err) {
      console.error(err);
      throw new Error("Error sending agreement");
    }
  },
  async fetchAgreements(userType: "landlord" | "tenant") {
    try {
      const res = await fetch(`${BASE_API_URL}/agreements/?as=${userType}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }

      const result = await res.json();
      const filteredAgreements = result.results;
      const modifiedResult = await Promise.all(
        filteredAgreements.map(async (agreement: any) => {
          const property = await propertyRepository.fetchProperty(
            agreement.property_id
          );
          console.log("FETCHED PROPERTY", property);
          let data = { ...agreement, property };
          return data;
        })
      );
      console.log("modified", modifiedResult);
      return { ...result, results: modifiedResult };
    } catch (err) {
      console.error("Error fetching agreement:", err);
      throw new Error("Error fetching agreement");
    }
  },
  async updateAgreement() {},
  async fetchAgreementByProperty(
    property_id: number,
    userType: "landlord" | "tenant"
  ) {
    try {
      const res = await fetch(
        `${BASE_API_URL}/agreements?property_id=${property_id}&as=${userType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${getCookie("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const result = await res.json();
      return result;
    } catch (err: any) {
      throw new Error("Error fetching agreement");
    }
  },
  async fetchAgreement(agreementId: number, userType: "landlord" | "tenant") {
    try {
      const res = await fetch(
        `${BASE_API_URL}/agreements/${agreementId}?as=${userType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${getCookie("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const result = await res.json();
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching agreement");
    }
  },

  async setAgreementVerdict(
    agreementId: number,
    status: "ACCEPTED" | "REJECTED"
  ) {
    try {
      const res = await fetch(
        `${BASE_API_URL}/agreements/${agreementId}?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update agreement");
      }

      return res.json();
    } catch (err: any) {
      throw new Error(err.message || "Network error");
    }
  },
};
