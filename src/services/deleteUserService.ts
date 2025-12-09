import axios from "axios";
export const performUserDeletionFlow = async (
  username: string,
  customerId: string,
  API_URL: string
) => {
  const DEP_URL = process.env.REACT_APP_DEP_TAMYUZ_API_BASE_URL;
 
  try {
    console.log(" Starting delete flow");
    console.log("Username:", username);
    console.log("Customer ID:", customerId);
    console.log("Delete URL:", API_URL);
    console.log(" Loaded DEP URL:", process.env.REACT_APP_DEP_TAMYUZ_API_BASE_URL);


    // First API
    console.log(" Calling FIRST API:", `${DEP_URL}/DEPuserDelete`);
    const firstResponse = await axios.post(`${DEP_URL}/DEPuserDelete`, { username });

    console.log("First API status:", firstResponse.status);
    console.log("First API response:", firstResponse.data);

    if (firstResponse.status !== 200) {
      console.error(" First API failed");
      return { success: false, step: "first" };
    }

    //  Second API
    console.log(" Calling SECOND API:", `${DEP_URL}/ARXUserDelete`);
    const secondResponse = await axios.post(`${DEP_URL}/ARXUserDelete`, { username });

    console.log("Second API status:", secondResponse.status);
    console.log("Second API response:", secondResponse.data);

    if (secondResponse.status !== 200) {
      console.error(" Second API failed");
      return { success: false, step: "second" };
    }

    //  Final API
    console.log(" Calling FINAL API:", `${API_URL}/customers/${customerId}`);
    const finalDelete = await axios.delete(`${API_URL}/customers/${customerId}`);

    console.log("Final delete status:", finalDelete.status);

    return { success: true };

  } catch (err: any) {
    console.error(" Delete flow error:", err.response?.data || err.message);
    return { success: false, step: "exception", error: err };
  }
};

