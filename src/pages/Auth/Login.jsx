import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authContext = useAuth();
  const { user, role: userRole } = authContext || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin");
      // if (userRole === 'admin') {
      //   navigate('/admin');
      // } else if (userRole === 'captain') {
      //   navigate('/captain');
      // }
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (data) => {
    setLoading(true);
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;
      setLoading(false);
      // if (role === "admin") {
      navigate("/admin");
      // } else if (role === "captain") {
      // navigate("/captain");
      // }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  // const clicktoFill = () => {
  //   form.setValue('email', 'testing@gmail.com');
  //   form.setValue('password', 'password');
  // }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      {/* <button onClick={clicktoFill} className='rounded-xl bg-gray-500 text-white px-6 py-2'>Click to fill</button> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="w-full max-w-xs"
        >
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Email"
                {...form.register("email")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </FormItem>
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
          </FormItem>
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
