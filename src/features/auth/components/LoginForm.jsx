import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import FormField from "@/components/form/FormField";
import PasswordField from "@/components/form/PasswordField";
import { Button } from "@/components/ui/button";
import AgreementDialog from './AgreementDialog';
import { useTranslation } from "react-i18next";
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { handleApiRequest } from '@/lib/handleApiRequest';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { loginFields } from '@/constants/formFields';
import { loginUser, getConnectedUser } from '@/services/auth';
import storage from '@/lib/storage';
import { toast } from 'sonner';

export default function LoginForm() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [agreedToTerms, setAgreedToTerms] = useState(true);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(true);
    const [showAgreementError, setShowAgreementError] = useState(false);
    const [manualAgreement, setManualAgreement] = useState(true);
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    // Extract ALL params
    const redirectBack = searchParams.get('redirect_back');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const intent = searchParams.get('intent');

    const decodedRedirectBack = redirectBack ? decodeURIComponent(redirectBack) : null;
    const isWordPressLogin = decodedRedirectBack && (
        decodedRedirectBack.includes('http://client.lahza.ma/') || 
        decodedRedirectBack.includes('https://client.lahza.ma/')
    );

    console.log('Login params:', { origin, destination, intent, redirectBack });

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm({
        mode: 'onChange',
        defaultValues: loginFields.reduce((acc, field) => ({
            ...acc,
            [field.name]: ''
        }), {})
    });

    const onFormSubmit = async (data) => {
        const payload = {
            username: data.email,
            password: data.password,
        };
        
        console.log('Login attempt:', { 
            email: data.email, 
            isWordPressLogin,
            hasFormData: !!(origin && destination)
        });

        try {
            const response = await loginUser(payload, isWordPressLogin);
            
            console.log("✅ Login response:", response);

            if (response?.loginError) {
                toast.error(response.loginError);
                return;
            }

            const { token, user } = response || {};

            let resolvedUser = user;
            if (token && !resolvedUser) {
                try {
                    resolvedUser = await getConnectedUser();
                } catch (e) {
                    console.warn('Failed to fetch connected user after login:', e);
                }
            }

            if (!token) {
                toast.error('Invalid server response - no token received.');
                return;
            }
    console.log('🔍 Debug params:', { 
        origin, 
        destination, 
        intent,
        hasOrigin: !!origin,
        hasDestination: !!destination,
        intentIsSearch: intent === 'search'
    });
            // Clear and store auth
            storage.clearAuth();
            storage.setToken(token);
            if (resolvedUser) {
                storage.setUser(resolvedUser);
            }
            setAuth(resolvedUser || null, token);

            // Check verification status
            const status = resolvedUser?.status || resolvedUser?.userStatus || null;
            const needsVerification =
                status === 'WAITING_FOR_MAIL_CONFIRMATION' ||
                status === 'WAITING_FOR_EMAIL_CONFIRMATION' ||
                resolvedUser?.emailVerified === false ||
                resolvedUser?.verified === false;

            if (needsVerification) {
                toast("Your account requires email confirmation. Please verify your email to access the app.");
                navigate('/auth/emailVerify', { replace: true });
                return;
            }

           // ✅ PRIORITY 1: Handle form data from WordPress (origin + destination)
if (origin && destination) {
    console.log('✅ Origin and destination found! Redirecting to compare-options');
    console.log('Origin:', origin);
    console.log('Destination:', destination);
    
    const searchParams = new URLSearchParams({
        origin,
        destination
    });
    
    const finalUrl = `/compare-options?${searchParams.toString()}`;
    console.log('🚀 Navigating to:', finalUrl);
    
    toast.success('Login successful! Loading your search...');
    navigate(finalUrl, { replace: true });
    return;
}

console.log('⚠️ No origin/destination, checking WordPress redirect...');

            // ✅ PRIORITY 2: Handle WordPress redirect with token
            if (isWordPressLogin && redirectBack) {
                const redirectUrl = new URL(redirectBack);
                redirectUrl.searchParams.set('token', token);
                
                // Pass origin/destination if they exist
                if (origin) redirectUrl.searchParams.set('origin', origin);
                if (destination) redirectUrl.searchParams.set('destination', destination);
                
                toast.success('Login successful! Redirecting to WordPress...');
                
                console.log('🔄 Redirecting to:', redirectUrl.toString());
                
                setTimeout(() => {
                    window.location.href = redirectUrl.toString();
                }, 800);
                return;
            }

            // ✅ PRIORITY 3: Default dashboard redirect
            toast.success(t('loginForm.notifications.success'));
            navigate('/dashboard', { replace: true });

        } catch (err) {
            console.error('❌ Login error:', err);
            toast.error(err.message || t('common.generic-error'));
        }
    };

    // Helper function to build URL with params


    const isReadyToSubmit = isValid && agreedToTerms && agreedToPrivacy;

    return (
        <div className="p-6 md:p-8">
            {(origin && destination) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    🔍 Searching: {origin} → {destination}
                </div>
            )}
            
            {isWordPressLogin && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    🔗 You'll be redirected back to WordPress after login
                </div>
            )}
            
            
            <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">{t('loginForm.welcome')}</h1>
                    <p className="text-muted-foreground text-balance">
                        {t('loginForm.subtitle')}
                    </p>
                </div>

                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: t('validation.emailRequired'),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('validation.invalidEmail')
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <FormField
                            label="Email"
                            placeholder="m@example.com"
                            onChange={(payload) => field.onChange(payload.value)}
                            value={field.value}
                            name={field.name}
                            error={error?.message}
                            isValueValid={!error}
                            onBlur={field.onBlur}
                            autoComplete='username'
                        />
                    )}
                />

                <div className="grid gap-1">
                    <div className="flex items-center">
                        <label className="text-foreground text-sm leading-4 font-medium">
                            {t('loginForm.passwordLabel')} <span className="text-destructive ml-1 h-min leading-0">*</span>
                        </label>
                        <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                            {t('loginForm.forgotPassword')}
                        </a>
                    </div>

                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: t('validation.passwordRequired'),
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
                                message: t('validation.passwordComplexity')
                            }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <PasswordField
                                className="flex-1"
                                onChange={(payload) => field.onChange(payload.value)}
                                value={field.value}
                                name={field.name}
                                error={error?.message}
                                isValueValid={!error}
                                onBlur={field.onBlur}
                                autoComplete='current-password'
                            />
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!isReadyToSubmit || isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? t('loginForm.notifications.loading') : t('loginForm.loginButton')}
                </Button>

                <div className="text-center text-sm">
                    {t('loginForm.noAccount')}{' '}
                    <a 
                        href={isWordPressLogin ? `/auth/register?redirect_back=${redirectBack}` : "/auth/register"} 
                        className="underline underline-offset-4"
                    >
                        {t('loginForm.signUp')}
                    </a>
                </div>
            </form>

            <label htmlFor="terms" className="text-muted-foreground flex flex-wrap justify-center items-center text-xs mt-6">
                <Checkbox
                    checked={agreedToTerms && agreedToPrivacy}
                    id='terms'
                    onCheckedChange={(checked) => {
                        setAgreedToPrivacy(checked === true)
                        setAgreedToTerms(checked === true)
                        setShowAgreementError(checked !== true)
                        setManualAgreement(checked === true)
                    }}
                    className={`size-4 mr-2 ${showAgreementError && '!border !border-destructive'}`}
                />
                {!showAgreementError ? (
                    <span>{t('agreement.clickingAgree')}&nbsp;</span>
                ) : (
                    <span className='text-destructive text-center text-xs flex'>{t('agreement.mustAgree')}&nbsp;</span>
                )}
                <AgreementDialog
                    title={t('loginForm.agreement_terms')}
                    sections={t('terms.sections', { returnObjects: true })}
                    onAgree={() => setAgreedToTerms(true)}
                    onOpen={() => {
                        if (manualAgreement) {
                            setManualAgreement(false)
                            setAgreedToTerms(false)
                            setAgreedToPrivacy(false)
                        }
                    }}
                />
                <span className={showAgreementError ? 'text-destructive' : ''}>&nbsp;{t('and')}&nbsp;</span>
                <AgreementDialog
                    title={t('loginForm.agreement_privacy')}
                    sections={t('privacy.sections', { returnObjects: true })}
                    onAgree={() => setAgreedToPrivacy(true)}
                    onOpen={() => {
                        if (manualAgreement) {
                            setManualAgreement(false)
                            setAgreedToTerms(false)
                            setAgreedToPrivacy(false)
                        }
                    }}
                />
                <span>.</span>
            </label>
        </div>
    );
}