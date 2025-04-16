import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgradeClick = () => {
    navigate('/payment');
  };

  const handleDowngradeClick = () => {
    toast({ title: "Coming Soon", description: "Downgrade functionality is not yet available.", variant: "default" });
  };

  const handleUpdateProfileClick = () => {
    toast({ title: "Coming Soon", description: "Profile update functionality is not yet available.", variant: "default" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View your account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="font-medium text-sm text-gray-500 block">Full Name</label>
                  <p>{user?.name || '-'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="font-medium text-sm text-gray-500 block">Email Address</label>
                  <p>{user?.email || '-'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="font-medium text-sm text-gray-500 block">Account Type</label>
                  <div className="flex items-center">
                    <span className={`capitalize font-medium ${user?.subscriptionTier === 'premium' ? 'text-brand-purple' : 'text-gray-700'}`}>
                      {user?.subscriptionTier || '-'} 
                    </span>
                    {user?.subscriptionTier === 'premium' && (
                      <CheckCircle2 className="ml-2 h-4 w-4 text-brand-purple" />
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfileClick}>Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`border ${user?.subscriptionTier === 'free' ? 'border-brand-purple border-2 shadow-lg' : ''}`}>
                <CardHeader>
                  <CardTitle>Free Plan</CardTitle>
                  <CardDescription>Basic access to ChatBPT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$0<span className="text-base font-normal text-gray-500">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Up to 10 AI responses per day</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Standard response time</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionTier === 'free' ? (
                    <Button variant="outline" disabled>Current Plan</Button>
                  ) : (
                    <Button variant="outline" onClick={handleDowngradeClick}>Downgrade</Button>
                  )}
                </CardFooter>
              </Card>
              
              <Card className={`border ${user?.subscriptionTier === 'premium' ? 'border-brand-purple border-2 shadow-lg' : ''}`}>
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <CardDescription>Advanced features and unlimited access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$4<span className="text-base font-normal text-gray-500">/month</span></div> 
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Unlimited AI responses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Priority response time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Access to future advanced features</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionTier === 'premium' ? (
                    <Button variant="outline" disabled>Current Plan</Button>
                  ) : (
                    <Button onClick={handleUpgradeClick}>Upgrade to Premium</Button>
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
                  Customize your ChatBPT experience (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Preference settings are not yet available.
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
