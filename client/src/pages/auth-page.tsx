import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const search = useSearch();
  const redirectUrl = new URLSearchParams(search).get("redirect") || "/";
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    if (user && !isLoading) {
      navigate(redirectUrl);
    }
  }, [user, isLoading, navigate, redirectUrl]);

  // ---------------- LOGIN ----------------
  const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  // ---------------- REGISTER ----------------
  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    aadhaar: z.string().min(12, "Valid Aadhaar number is required"),
    address: z.string().min(10, "Address is required"),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      mobile: "",
      aadhaar: "",
      address: "",
    },
  });

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };

  // ---------------- REDIRECT LOADER ----------------
  if (user && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Redirecting...</p>
      </div>
    );
  }

  // ---------------- MAIN RENDER ----------------
  return (
    <>
      <Helmet>
        <title>Login or Register - CertAi</title>
        <meta
          name="description"
          content="Login or create an account to apply for government certificates online including caste, income, and residence certificates."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
              <div className="lg:w-1/2">
                <Card>
                  <CardContent className="pt-6">
                    <Tabs
                      defaultValue="login"
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>

                      {/* LOGIN TAB */}
                      <TabsContent value="login">
                        <h1 className="text-2xl font-bold mb-6 text-secondary">
                          Login to Your Account
                        </h1>

                        <Form {...loginForm}>
                          <form
                            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your username"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Enter your password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Logging in...
                                </>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-neutral-600">
                            Don’t have an account?{" "}
                            <button
                              onClick={() => setActiveTab("register")}
                              className="text-primary hover:underline"
                            >
                              Register now
                            </button>
                          </p>
                        </div>
                      </TabsContent>

                      {/* REGISTER TAB */}
                      <TabsContent value="register">
                        <h1 className="text-2xl font-bold mb-6 text-secondary">
                          Create a New Account
                        </h1>

                        <Form {...registerForm}>
                          <form
                            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={registerForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="As per Aadhaar" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="aadhaar"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Aadhaar Number*</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="12 digit Aadhaar number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={registerForm.control}
                                name="mobile"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mobile Number*</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="10 digit mobile number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address*</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Your email address"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your permanent address"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Choose a username"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password*</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Choose a secure password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center space-x-2 mt-4">
                              <input
                                type="checkbox"
                                id="terms"
                                className="rounded border-neutral-300 text-primary focus:ring-primary"
                                required
                              />
                              <label
                                htmlFor="terms"
                                className="text-sm text-neutral-700"
                              >
                                I agree to the terms and conditions and privacy
                                policy
                              </label>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Registering...
                                </>
                              ) : (
                                "Register"
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-neutral-600">
                            Already have an account?{" "}
                            <button
                              onClick={() => setActiveTab("login")}
                              className="text-primary hover:underline"
                            >
                              Login here
                            </button>
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="bg-secondary text-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">
                    Government e-Certificate Portal
                  </h2>
                  <p className="mb-6">
                    The official platform for applying and obtaining government
                    certificates online with secure verification.
                  </p>

                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span>
                        Easy application process for various government
                        certificates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span>AI-powered document verification</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span>Secure digital certificates with QR verification</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span>Real-time application status tracking</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span>24/7 support for all your certification needs</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow border border-neutral-200">
                  <h3 className="font-medium text-lg mb-2">Need Help?</h3>
                  <p className="text-neutral-600 mb-4">
                    For assistance with registration or login issues, contact our
                    support team.
                  </p>
                  <div className="flex items-center text-neutral-700">
                    <i className="fas fa-phone-alt mr-2 text-primary"></i>
                    <span>Toll-Free: 1800-XXX-XXXX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
