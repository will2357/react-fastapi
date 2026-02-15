import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import apiClient from "../api/client";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function ConfirmSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const confirmed = useRef(false);

  useEffect(() => {
    if (confirmed.current) return;

    const confirmSignup = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid confirmation link");
        return;
      }

      try {
        await apiClient.get(`/api/v1/auth/confirm/${token}`);
        confirmed.current = true;
        navigate("/login?confirmed=true");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 200) {
            confirmed.current = true;
            navigate("/login?confirmed=true");
          } else if (err.response?.data?.detail) {
            setStatus("error");
            setErrorMessage(err.response.data.detail);
          } else {
            setStatus("error");
            setErrorMessage("Confirmation failed");
          }
        } else {
          setStatus("error");
          setErrorMessage("Confirmation failed");
        }
      }
    };

    confirmSignup();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Confirming...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we confirm your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-destructive">
              Confirmation Failed
            </CardTitle>
            <CardDescription className="text-center">{errorMessage}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/signup")}>
              Sign up again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">Account Confirmed!</CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully confirmed. You can now log in.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/login?confirmed=true")}>
            Go to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ConfirmSignup;
