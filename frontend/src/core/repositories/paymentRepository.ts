import { BASE_API_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookieHelper";

export const paymentRepository = {
  async initatePayment(agreementId: number, amount: number) {
    try {
      const res = await fetch(`${BASE_API_URL}/payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
        body: JSON.stringify({ amount: amount, agreement_id: agreementId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const result = await res.json();
      return result.payment_url;
    } catch (err: any) {
      console.error(err);
      throw new Error("Payment failed");
    }
  },
  async setVerdict(uuid: string, status: string) {
    if (status === "User canceled") {
      status = "FAILED";
    } else if (status === "Completed") {
      status = "SUCCESSFUL";
    } else {
      status = "PENDING";
    }
    try {
      const res = await fetch(
        `${BASE_API_URL}/payment/${uuid}?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
    } catch (err: any) {
      console.error(err);
      throw new Error("Payment failed");
    }
  },

  async getPayments(userType: "tenant" | "landlord") {
    try {
      const res = await fetch(`${BASE_API_URL}/payment/?as=${userType}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }

      const result = await res.json();
      return result.results;
    } catch (err: any) {
      console.error(err);
      throw new Error("Fetching Payments failed");
    }
  },
};
