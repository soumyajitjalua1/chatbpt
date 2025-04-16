import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { CreditCard, LogIn } from 'lucide-react'; // Example icons
import { fetchWithCredentials } from '@/utils/api'; // Import from utils

const PaymentPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handlePayment = async (paymentMethod: string) => {
        setIsLoading(true);
        console.log(`Processing payment with ${paymentMethod}...`); // Simulate payment processing

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // After simulated payment success, call the upgrade API
            await fetchWithCredentials('/api/users/upgrade', { method: 'POST' });
            
            toast({
                title: "Upgrade Successful!",
                description: "You are now on the Premium tier.",
            });

            // Navigate back to account page after successful upgrade
            navigate('/account'); 
            // Consider a state management solution for smoother UI update without reload
            // window.location.reload(); // Avoid reload if possible

        } catch (error: any) {
            console.error(`Payment/Upgrade failed for ${paymentMethod}:`, error);
            toast({
                title: "Upgrade Failed",
                description: error.message || `Could not complete upgrade via ${paymentMethod}. Please try again.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Upgrade to Premium</CardTitle>
                        <CardDescription>
                            Choose your preferred payment method to unlock unlimited messages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-lg font-semibold">Total: $4.00</p>
                        <Button 
                            className="w-full justify-start gap-3" 
                            variant="outline"
                            onClick={() => handlePayment('Credit Card')}
                            disabled={isLoading}
                        >
                            <CreditCard className="h-5 w-5" />
                            <span>{isLoading ? 'Processing...' : 'Pay with Credit Card'}</span>
                        </Button>
                        <Button 
                            className="w-full justify-start gap-3" 
                            variant="outline"
                            onClick={() => handlePayment('PayPal')}
                            disabled={isLoading}
                        >
                            {/* Replace with PayPal icon if available */}
                            <LogIn className="h-5 w-5" /> 
                            <span>{isLoading ? 'Processing...' : 'Pay with PayPal'}</span>
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-gray-500 text-center w-full">
                            This is a simulated payment process for demonstration purposes.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PaymentPage; 