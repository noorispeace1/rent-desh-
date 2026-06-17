"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

// Hero UI v3 Composable Imports
import { 
  Card, 
  Button, 
  Link, 
  TextField, 
  Label, 
  InputGroup, 
  Input, 
  FieldError 
} from "@heroui/react";

// Gravity UI Icons
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";

// Better Auth Client (Make sure path is correct)
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();
  
  // State Management
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  // Credentials Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        toast.error(authError.message || "Invalid email or password.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        toast.success("Signed in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/"); 
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        setError(error.message || "Google Sign-In failed.");
        setGoogleLoading(false);
      }
    } catch (err) {
      setError("Something went wrong with Google Sign-In.");
      setGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}
    >
      
      {/* Dark/Blur Overlay for the background image */}
      <div className="absolute inset-0 bg-[#4E342E]/40 backdrop-blur-sm -z-10" />

      {/* Main Card Container */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-white/20 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-2">
            <span className="font-serif font-bold text-3xl text-[#4E342E] tracking-wide">
              Rent<span className="text-[#8D6E63]">Desh</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#3E2723] tracking-tight">Welcome Back</h1>
          <p className="text-[#795548] text-sm mt-1 text-center">
            Sign in to your RentDesh account.
          </p>
        </div>

        {/* System Messages */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm text-center font-medium">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          
          {/* Email Field */}
          <TextField className="w-full flex flex-col">
            <Label className="text-[#5D4037] font-semibold text-sm mb-1.5 ml-1">Email Address</Label>
            <InputGroup 
              startContent={<At className="text-[#A1887F] w-5 h-5 ml-3" />}
              className="w-full flex items-center border border-[#D7CCC8] hover:border-[#6D4C41] focus-within:border-[#009282] focus-within:ring-1 focus-within:ring-[#009282] rounded-xl transition-all h-12 bg-[#F9F6F4]"
            >
              <Input 
                type="email"
                name="email"
                placeholder="example@rentdesh.com" 
                value={formData.email}
                onChange={handleChange}
                className="w-full flex-1 px-3 bg-transparent text-[#3E2723] outline-none" 
              />
            </InputGroup>
            <FieldError />
          </TextField>

          {/* Password Field */}
          <TextField className="w-full flex flex-col">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <Label className="text-[#5D4037] font-semibold text-sm">Password</Label>
              <Link as={NextLink} href="/forgot-password" className="text-xs text-[#009282] hover:text-[#007a6c] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <InputGroup 
              startContent={<ShieldKeyhole className="text-[#A1887F] w-5 h-5 ml-3" />}
              endContent={
                <button 
                  type="button" 
                  onClick={toggleVisibility} 
                  className="focus:outline-none mr-3 text-[#A1887F] hover:text-[#5D4037] transition-colors flex items-center"
                  aria-label="toggle password visibility"
                >
                  {isVisible ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              className="w-full flex items-center border border-[#D7CCC8] hover:border-[#6D4C41] focus-within:border-[#009282] focus-within:ring-1 focus-within:ring-[#009282] rounded-xl transition-all h-12 bg-[#F9F6F4]"
            >
              <Input 
                type={isVisible ? "text" : "password"}
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                className="w-full flex-1 px-3 bg-transparent text-[#3E2723] outline-none" 
              />
            </InputGroup>
            <FieldError />
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            size="lg"
            className="w-full mt-2 bg-[#009282] text-white font-semibold py-6 rounded-xl shadow-[0_4px_14px_rgba(0,146,130,0.3)] hover:shadow-[0_6px_20px_rgba(0,146,130,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#EFEBE9]"></div>
          <span className="text-xs text-[#A1887F] uppercase tracking-wider font-semibold">or</span>
          <div className="flex-1 h-px bg-[#EFEBE9]"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          isLoading={googleLoading}
          onClick={handleGoogleSignIn}
          variant="bordered"
          size="lg"
          className="w-full h-12 bg-white border border-[#D7CCC8] hover:border-[#8D6E63] text-gray-700 font-medium rounded-xl hover:bg-[#F9F6F4] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {!googleLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
          )}
          Continue with Google
        </Button>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#795548] mt-6">
          Don't have an account?{" "}
          <Link as={NextLink} href="/signup" className="text-[#009282] font-semibold hover:text-[#007a6c] hover:underline transition-all">
            Sign Up
          </Link>
        </p>
        
      </Card>
    </div>
  );
};

export default SignInPage;