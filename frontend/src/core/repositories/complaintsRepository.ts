import { BASE_API_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookieHelper";

export const ComplaintsRepository = {
  async updateComplaint(complaintId: number) {
    try {
      const res = await fetch(
        `${BASE_API_URL}/complaints/${complaintId}?status=RESOLVED`,
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
    } catch (err) {
      throw new Error("Error updating complaints");
    }
  },
  async fetchComplaints(userType: string) {
    try {
      const res = await fetch(`${BASE_API_URL}/complaints/?as=${userType}`, {
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
      return result;
    } catch (err) {
      throw new Error("Error Fetching complaints");
    }
  },
  async fetchComplaint() {
    try {
      const res = await fetch(`${BASE_API_URL}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
    } catch (err) {
      throw new Error("Error Fetching complaint");
    }
  },
  async postComplaint(data: any, agreementId: number) {
    try {
      const res = await fetch(`${BASE_API_URL}/complaints/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          agreement_id: agreementId,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const result = await res.json();
      return result;
    } catch (err) {
      throw new Error("Error posting complaint");
    }
  },
};
