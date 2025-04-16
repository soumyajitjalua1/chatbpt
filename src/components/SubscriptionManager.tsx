import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Assume fetchWithCredentials is in AuthContext or imported from a util
// If it's not exported from AuthContext, you might need to duplicate it 
// or move it to a shared utils file.
// For now, let's assume we can re-declare or import it.
const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        },
    });
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || 'API request failed');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    } else {
        return null;
    }
};

const SubscriptionManager = () => {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // We need a way to update the user state in AuthContext after upgrade.
    // Adding a refresh function to AuthContext is one way, or just rely on
    // page reload / re-check status on navigation.
    // Let's assume for now the context might need manual update or reload.

    const handleUpgradeClick = () => {
        navigate('/payment');
    };

    if (authLoading || !user) {
        return <div>Loading subscription status...</div>; // Or a skeleton loader
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                    Manage your subscription plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Your current tier: <span className="font-semibold capitalize">{user.subscriptionTier}</span></p>
                {user.subscriptionTier === 'free' && (
                    <p className="text-sm text-gray-600 mt-2">
                        Upgrade to Premium for unlimited messages and priority access.
                    </p>
                )}
            </CardContent>
            <CardFooter>
                {user.subscriptionTier === 'free' && (
                    <Button onClick={handleUpgradeClick}>
                        Upgrade to Premium ($4)
                    </Button>
                )}
                {user.subscriptionTier === 'premium' && (
                     <p className="text-sm text-green-600">You are on the Premium plan.</p>
                )}
            </CardFooter>
        </Card>
    );
};

export default SubscriptionManager; 