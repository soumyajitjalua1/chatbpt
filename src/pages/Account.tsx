
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-500">Full Name</h3>
                  <p>{user?.name}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-500">Email Address</h3>
                  <p>{user?.email}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-500">Account Type</h3>
                  <div className="flex items-center">
                    <span className={user?.subscriptionTier === 'premium' ? 'text-brand-purple' : ''}>
                      {user?.subscriptionTier === 'premium' ? 'Premium' : 'Free'} account
                    </span>
                    {user?.subscriptionTier === 'premium' && (
                      <CheckCircle2 className="ml-2 h-4 w-4 text-brand-purple" />
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={user?.subscriptionTier === 'free' ? 'border-brand-purple border-2' : ''}>
                <CardHeader>
                  <CardTitle>Free Plan</CardTitle>
                  <CardDescription>Basic access to ChatBPT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$0<span className="text-base font-normal text-gray-500">/month</span></div>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Up to 10 messages per day</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Standard response time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Basic chat history (7 days)</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionTier === 'free' ? (
                    <Button variant="outline" disabled>Current Plan</Button>
                  ) : (
                    <Button variant="outline">Downgrade</Button>
                  )}
                </CardFooter>
              </Card>
              
              <Card className={user?.subscriptionTier === 'premium' ? 'border-brand-purple border-2' : ''}>
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <CardDescription>Advanced features and unlimited access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$9.99<span className="text-base font-normal text-gray-500">/month</span></div>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Unlimited messages</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Priority response time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Access to advanced features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Unlimited chat history</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Premium customer support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionTier === 'premium' ? (
                    <Button variant="outline" disabled>Current Plan</Button>
                  ) : (
                    <Button>Upgrade to Premium</Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your ChatBPT experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Preferences will be available in a future update. Stay tuned!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
