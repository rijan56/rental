import { BASE_API_URL } from "@/lib/constants";

interface ILoginForm {
  username: string;
  password: string;
  type: "tenant" | "landlord";
}

interface IRegisterForm {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  password: string;
  type: "tenant" | "landlord";
}

export const login = async (data: ILoginForm) => {
  const response = await fetch(`${BASE_API_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
  }
  const result = await response.json();
  console.log(result);
  return result;
};

export const SignUp = async (data: IRegisterForm) => {
  const response = await fetch(`${BASE_API_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
  }
  return await response.json();
};

export const getUserProfile = async (token: string) => {
  const response = await fetch(`${BASE_API_URL}/auth/self`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    console.log(error);
  }
  const result = await response.json();
  return result;
};
