import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  user: [],
  loading: false,
  error: null,
  status: false,
};

export const login = createAsyncThunk(
  "user/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://10.8.10.40:5000/user/login",
        userData
      );
      toast.success("Succesfully Login", {
        position: "bottom-left",
      });
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.success(`Login failed: ${error.response.data}`, {
        position: "bottom-left",
      });
      return error.response.data;
    }
  }
);

export const signup = createAsyncThunk("user/signup", async (userData) => {
  const response = await axios.post(
    "http://10.8.10.40:5000/user/signup",
    userData
  );
  return response.data;
});

const authApi = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);

        state.user = action.payload;
        state.loading = false;
        state.status = true;
        
        navigateToHome();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.success(`OOPs: Error Connection refused ${state.error}`, {
          position: "bottom-left",
        });
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = true;
        toast.success("Succesfully Signup", {
          position: "bottom-left",
        });
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authApi.reducer;

function navigateToHome() {
  // return navigate("/home");
}

function navigateToLogin() {
  // return navigate("/login");
}
