import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSignIn, useSignUp, useSSO } from '@clerk/expo';
import Svg, { Path } from 'react-native-svg';
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Mail,
  CheckCircle2,
  Lock,
  User,
  MapPin,
  Building,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react-native';

import { Button } from '@/components/common/Button';
import { useApp, UserRole } from '@/context/AppContext';
import { saveAuthProfile } from '@/lib/supabase';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function AuthScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { fontScale, showToast, setUserRole } = useApp();

  const [portalRole, setPortalRole] = useState<UserRole>('citizen');
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneForEmail, setPhoneForEmail] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [block, setBlock] = useState('Ranchi Sadar');

  // Loading States
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isVerifyingSubmitting, setIsVerifyingSubmitting] = useState(false);

  // Verification State
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    let interval: any;
    if (isVerifyingEmail && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVerifyingEmail, resendTimer]);

  const handleRoleChange = (role: UserRole) => {
    setPortalRole(role);
    setUserRole(role);
  };

  // Google OAuth Flow with Clerk
  const handleGoogleAuth = async () => {
    setIsGoogleSubmitting(true);
    try {
      const { createdSessionId, setActive, signUp: ssoSignUp } = await startSSOFlow({
        strategy: 'oauth_google',
        unsafeMetadata: {
          role: portalRole,
          district: district.trim() || 'Ranchi',
          block: block.trim() || 'Ranchi Sadar',
        },
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        setUserRole(portalRole);
        showToast('Signed in successfully with Google!', 'success');
        router.replace('/');
        return;
      }

      if (ssoSignUp?.status === 'missing_requirements') {
        showToast('Additional setup needed for your Google account.', 'info');
      }
    } catch (err: any) {
      const errStr = String(err?.message || err || '');
      if (
        errStr.includes('cancelled') ||
        errStr.includes('canceled') ||
        errStr.includes('dismissed') ||
        errStr.includes('SIGN_IN_CANCELLED')
      ) {
        return;
      }
      console.error('Google auth error:', err);
      showToast(err?.message || 'Failed to authenticate with Google.', 'error');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  // Email Authentication (Sign In or Sign Up)
  const handleEmailAuth = async () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsEmailSubmitting(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          showToast('Please enter your full name.', 'error');
          setIsEmailSubmitting(false);
          return;
        }

        const nameParts = fullName.trim().split(' ');
        const { error: signUpError } = await signUp.password({
          emailAddress: email.trim(),
          password,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || undefined,
          unsafeMetadata: {
            role: portalRole,
            district: district.trim() || 'Ranchi',
            block: block.trim() || 'Ranchi Sadar',
            phone: phoneForEmail.trim() ? `+91 ${phoneForEmail.trim()}` : '',
          },
        });

        if (signUpError) {
          showToast(signUpError.message || 'Registration failed. Please try again.', 'error');
          setIsEmailSubmitting(false);
          return;
        }

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
          showToast(sendError.message || 'Failed to send verification code.', 'error');
          setIsEmailSubmitting(false);
          return;
        }

        setIsVerifyingEmail(true);
        setResendTimer(60);
        showToast(`Verification code sent to ${email.trim()}!`, 'success');
      } else {
        const { error: signInError } = await signIn.password({
          emailAddress: email.trim(),
          password,
        });

        if (signInError) {
          showToast(signInError.message || 'Incorrect email or password.', 'error');
          setIsEmailSubmitting(false);
          return;
        }

        if (signIn?.status === 'complete') {
          const { error: finalizeError } = await signIn.finalize();
          if (finalizeError) {
            showToast(finalizeError.message || 'Failed to complete sign-in.', 'error');
            setIsEmailSubmitting(false);
            return;
          }

          showToast('Welcome back! Signed in successfully.', 'success');
          router.replace('/');
          return;
        }

        if (signIn?.status === 'needs_client_trust' || signIn?.status === 'needs_second_factor') {
          const emailFactor = (signIn as any)?.supportedSecondFactors?.find(
            (f: any) => f.strategy === 'email_code'
          );
          if (emailFactor) {
            await (signIn as any).mfa?.sendEmailCode?.();
          }
          setIsVerifyingEmail(true);
          setResendTimer(60);
          showToast('Verification code sent to your email for security.', 'info');
          setIsEmailSubmitting(false);
          return;
        }

        showToast(`Sign in requires: ${signIn?.status}`, 'info');
        setIsEmailSubmitting(false);
      }
    } catch (err: any) {
      showToast(err?.message || 'Authentication error. Please try again.', 'error');
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Verify Email Code
  const handleVerifyClerkCode = async () => {
    if (!verificationCode.trim()) {
      showToast('Please enter the verification code.', 'error');
      return;
    }

    setIsVerifyingSubmitting(true);
    try {
      if (!isSignUp) {
        const { error: verifyError } = await (signIn as any)?.mfa?.verifyEmailCode?.({
          code: verificationCode.trim(),
        });
        if (verifyError) {
          showToast(verifyError.message || 'Invalid or expired verification code.', 'error');
          setIsVerifyingSubmitting(false);
          return;
        }

        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          showToast(finalizeError.message || 'Failed to finalize session.', 'error');
          setIsVerifyingSubmitting(false);
          return;
        }

        showToast('Device verified! Welcome back to Samvad.', 'success');
        router.replace('/');
        return;
      }

      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });
      if (verifyError) {
        showToast(verifyError.message || 'Invalid or expired verification code.', 'error');
        setIsVerifyingSubmitting(false);
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        showToast(finalizeError.message || 'Failed to finalize session.', 'error');
        setIsVerifyingSubmitting(false);
        return;
      }

      const resolvedUserId = signUp.createdUserId || email.trim();

      await saveAuthProfile({
        id: resolvedUserId,
        email: email.trim(),
        full_name: fullName.trim(),
        phone: phoneForEmail.trim() ? `+91 ${phoneForEmail.trim()}` : '',
        role: portalRole,
        district: district.trim() || 'Ranchi',
        block: block.trim() || 'Ranchi Sadar',
        community_role:
          portalRole === 'citizen'
            ? 'Citizen Member'
            : portalRole === 'university'
            ? 'Faculty / Student'
            : portalRole === 'industry'
            ? 'CSR Lead'
            : 'District Nodal Officer',
      });

      setUserRole(portalRole);
      showToast('Account created and verified! Welcome to Samvad.', 'success');
      router.replace('/');
    } catch (err: any) {
      showToast(err?.message || 'Verification error.', 'error');
    } finally {
      setIsVerifyingSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    try {
      if (isSignUp) {
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) {
          showToast(error.message || 'Failed to resend code.', 'error');
          return;
        }
      } else {
        await (signIn as any).mfa?.sendEmailCode?.();
      }
      setResendTimer(60);
      showToast(`Verification code resent to ${email}!`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Could not resend code.', 'error');
    }
  };

  const roleDescriptions: Record<UserRole, string> = {
    citizen: 'Village, Panchayat, or Ward resident reporting challenges',
    university: 'Faculty, student, or researcher leading solution teams',
    industry: 'Corporate or MSME partner mentoring & funding prototypes',
    government: 'District or state department officer monitoring outcomes',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>SJ</Text>
            </View>
            <Text style={[styles.brandTitle, { fontSize: 24 * fontScale }]}>
              Samvad Jharkhand
            </Text>
            <Text style={styles.brandSubtitle}>
              Citizen-to-campus societal innovation portal for Jharkhand
            </Text>

            <View style={styles.verifiedPill}>
              <ShieldCheck size={13} color="#2563EB" />
              <Text style={styles.verifiedPillText}>
                Clerk Authentication · Verified Secure
              </Text>
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <View style={styles.roleHeaderRow}>
              <Text style={styles.roleLabel}>I am joining as:</Text>
              <View style={styles.roleTag}>
                <Sparkles size={11} color={SamadhanColors.primary} />
                <Text style={styles.roleTagText}>
                  {portalRole === 'citizen'
                    ? 'Citizen'
                    : portalRole === 'university'
                    ? 'University'
                    : portalRole === 'industry'
                    ? 'Industry'
                    : 'Admin'}
                </Text>
              </View>
            </View>

            <View style={styles.roleRow}>
              {(['citizen', 'university', 'industry', 'government'] as UserRole[]).map((role) => (
                <Pressable
                  key={role}
                  accessibilityRole="button"
                  accessibilityLabel={`Select role ${role}`}
                  onPress={() => handleRoleChange(role)}
                  style={[styles.roleChip, portalRole === role && styles.roleChipOn]}>
                  <Text
                    style={[
                      styles.roleChipText,
                      portalRole === role && styles.roleChipTextOn,
                    ]}>
                    {role === 'citizen'
                      ? '👤 Citizen'
                      : role === 'university'
                      ? '🎓 University'
                      : role === 'industry'
                      ? '🏢 Industry'
                      : '🏛️ Admin'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.roleHintText}>{roleDescriptions[portalRole]}</Text>
          </View>

          {/* Verification Code View */}
          {isVerifyingEmail ? (
            <View style={[styles.card, Shadows.md]}>
              <View style={styles.pendingBanner}>
                <Mail size={20} color="#2563EB" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pendingBannerTitle}>
                    Check Your Email
                  </Text>
                  <Text style={styles.pendingBannerText}>
                    We sent a verification code to <Text style={{ fontWeight: '700' }}>{email}</Text>. Enter it below to activate your account.
                  </Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>6-Digit Verification Code *</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    accessibilityLabel="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Enter code"
                    keyboardType="numeric"
                    maxLength={8}
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.textInputWithIcon}
                    autoFocus
                  />
                </View>
              </View>

              <Button
                title={isVerifyingSubmitting ? 'Verifying with Clerk...' : 'Verify & Continue'}
                onPress={handleVerifyClerkCode}
                disabled={isVerifyingSubmitting}
                variant="action"
                size="lg"
                icon={
                  isVerifyingSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <CheckCircle2 size={18} color="#FFFFFF" />
                  )
                }
                style={{ marginTop: Spacing.sm }}
              />

              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.timerNotice}>
                    Resend code in <Text style={{ fontWeight: '700' }}>{resendTimer}s</Text>
                  </Text>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Resend Verification Code"
                    onPress={handleResendCode}
                    style={styles.resendLink}>
                    <RefreshCw size={13} color={SamadhanColors.primary} />
                    <Text style={styles.resendLinkText}>Resend code</Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to registration"
                onPress={() => {
                  setIsVerifyingEmail(false);
                  setVerificationCode('');
                }}
                style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to {isSignUp ? 'Registration' : 'Sign In'}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.card, Shadows.md]}>
              {/* Google One-Tap / Social Auth */}
              <View style={styles.socialSection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                  onPress={handleGoogleAuth}
                  disabled={isGoogleSubmitting || isEmailSubmitting}
                  style={({ pressed }) => [
                    styles.googleBtn,
                    pressed && styles.googleBtnPressed,
                    (isGoogleSubmitting || isEmailSubmitting) && styles.btnDisabled,
                  ]}>
                  {isGoogleSubmitting ? (
                    <ActivityIndicator size="small" color="#4285F4" />
                  ) : (
                    <GoogleIcon size={20} />
                  )}
                  <Text style={styles.googleBtnText}>
                    {isGoogleSubmitting
                      ? 'Connecting to Google...'
                      : isSignUp
                      ? 'Sign up with Google'
                      : 'Continue with Google'}
                  </Text>
                </Pressable>
                <Text style={styles.googleSubtext}>
                  Instant sign-in & registration with your Google account
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with email</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign In vs Register Switcher */}
              <View style={styles.subModeSwitch}>
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: !isSignUp }}
                  accessibilityLabel="Switch to Sign In"
                  onPress={() => {
                    setIsSignUp(false);
                    setIsVerifyingEmail(false);
                  }}
                  style={[styles.subModeBtn, !isSignUp && styles.subModeBtnActive]}>
                  <Text
                    style={[
                      styles.subModeText,
                      !isSignUp && styles.subModeTextActive,
                    ]}>
                    Sign In
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSignUp }}
                  accessibilityLabel="Switch to Register New Account"
                  onPress={() => {
                    setIsSignUp(true);
                    setIsVerifyingEmail(false);
                  }}
                  style={[styles.subModeBtn, isSignUp && styles.subModeBtnActive]}>
                  <Text
                    style={[
                      styles.subModeText,
                      isSignUp && styles.subModeTextActive,
                    ]}>
                    Register New Account
                  </Text>
                </Pressable>
              </View>

              {/* Form Fields */}
              {isSignUp && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <View style={styles.inputWrapper}>
                      <User size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                      <TextInput
                        accessibilityLabel="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder={
                          portalRole === 'citizen'
                            ? 'e.g. Ramesh Kumar'
                            : portalRole === 'university'
                            ? 'e.g. Prof. Rajesh Sharma'
                            : portalRole === 'industry'
                            ? 'e.g. Alok Verma'
                            : 'e.g. District Officer'
                        }
                        placeholderTextColor={SamadhanColors.textMuted}
                        style={styles.textInputWithIcon}
                      />
                    </View>
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>District</Text>
                      <View style={styles.inputWrapper}>
                        <MapPin size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          accessibilityLabel="District"
                          value={district}
                          onChangeText={setDistrict}
                          placeholder="Ranchi"
                          placeholderTextColor={SamadhanColors.textMuted}
                          style={styles.textInputWithIcon}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>Block</Text>
                      <View style={styles.inputWrapper}>
                        <Building size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          accessibilityLabel="Block"
                          value={block}
                          onChangeText={setBlock}
                          placeholder="Ranchi Sadar"
                          placeholderTextColor={SamadhanColors.textMuted}
                          style={styles.textInputWithIcon}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Contact Mobile (Optional)</Text>
                    <View style={styles.inputWrapper}>
                      <Phone size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                      <TextInput
                        accessibilityLabel="Phone Number"
                        value={phoneForEmail}
                        onChangeText={setPhoneForEmail}
                        keyboardType="phone-pad"
                        placeholder="98765 43210"
                        placeholderTextColor={SamadhanColors.textMuted}
                        style={styles.textInputWithIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Email Address *</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    accessibilityLabel="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="your.email@example.com"
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.textInputWithIcon}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>
                  {isSignUp ? 'Create Password (min 6 chars) *' : 'Password *'}
                </Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    accessibilityLabel="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.textInputWithIcon}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}>
                    {showPassword ? (
                      <EyeOff size={16} color={SamadhanColors.textMuted} />
                    ) : (
                      <Eye size={16} color={SamadhanColors.textMuted} />
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Button
                title={
                  isEmailSubmitting
                    ? isSignUp
                      ? 'Creating Account...'
                      : 'Signing In...'
                    : isSignUp
                    ? 'Register New Account'
                    : 'Sign In with Email'
                }
                onPress={handleEmailAuth}
                disabled={isEmailSubmitting || isGoogleSubmitting}
                variant="action"
                size="lg"
                icon={
                  isEmailSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <ArrowRight size={18} color="#FFFFFF" />
                  )
                }
                style={{ marginTop: Spacing.md }}
              />

              {/* Switch prompt */}
              <View style={styles.switchPromptRow}>
                <Text style={styles.switchPromptText}>
                  {isSignUp ? 'Already registered?' : 'Need an account?'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isSignUp ? 'Sign in instead' : 'Register now'}
                  onPress={() => {
                    setIsSignUp(!isSignUp);
                    setIsVerifyingEmail(false);
                  }}>
                  <Text style={styles.switchPromptLink}>
                    {isSignUp ? 'Sign In' : 'Register now'}
                  </Text>
                </Pressable>
              </View>

              {/* Required mount point for Clerk bot protection */}
              <View nativeID="clerk-captcha" />
            </View>
          )}

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <ShieldCheck size={16} color="#16A34A" />
            <Text style={styles.privacyText}>
              Official Jharkhand societal innovation portal. Accounts are securely verified with Clerk Authentication under DPDP data protection standards.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: SamadhanColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: SamadhanColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    fontWeight: '900',
    color: SamadhanColors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 10,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  roleContainer: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SamadhanColors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: '#F8FAFC',
  },
  roleChipOn: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  roleChipTextOn: {
    color: '#FFFFFF',
  },
  roleHintText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.xl,
  },
  socialSection: {
    alignItems: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingVertical: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  googleBtnPressed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  googleSubtext: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SamadhanColors.border,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: '600',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subModeSwitch: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.lg,
  },
  subModeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  subModeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  subModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  subModeTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    minHeight: 46,
  },
  inputIcon: {
    marginRight: 6,
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  switchPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  switchPromptText: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
  },
  switchPromptLink: {
    fontSize: 12,
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  pendingBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pendingBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 2,
  },
  pendingBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  timerNotice: {
    fontSize: 12,
    color: SamadhanColors.textMuted,
  },
  resendLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  resendLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  backLink: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingVertical: 6,
  },
  backLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textMuted,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
  },
});
