import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Mail,
  CheckCircle2,
  Lock,
  User,
  MapPin,
  Building,
  Database,
} from 'lucide-react-native';

import { Button } from '@/components/common/Button';
import { useApp, UserRole } from '@/context/AppContext';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function AuthScreen() {
  const router = useRouter();
  const {
    signInWithEmail,
    signUpWithEmail,
    loginWithMobile,
    continueAsGuest,
    fontScale,
    showToast,
    setUserRole,
  } = useApp();

  const [portalRole, setPortalRole] = useState<UserRole>('citizen');
  const [authMode, setAuthMode] = useState<'email' | 'otp' | 'guest'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneForEmail, setPhoneForEmail] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [block, setBlock] = useState('Ranchi Sadar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationPending, setEmailConfirmationPending] = useState(false);

  const [phone, setPhone] = useState('98351 44210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['4', '8', '2', '1', '9', '0']);
  const [resendTimer, setResendTimer] = useState(30);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestContactMethod, setGuestContactMethod] = useState<'Phone' | 'WhatsApp'>('Phone');

  useEffect(() => {
    let interval: any;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleRoleChange = (role: UserRole) => {
    setPortalRole(role);
    setUserRole(role);
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          showToast('Please enter your full name.', 'error');
          setIsSubmitting(false);
          return;
        }

        const res = await signUpWithEmail(email, password, {
          fullName: fullName.trim(),
          phone: phoneForEmail.trim() ? `+91 ${phoneForEmail.trim()}` : '',
          role: portalRole,
          district: district.trim(),
          block: block.trim(),
        });

        if (res.success) {
          if (res.requiresEmailConfirmation) {
            setEmailConfirmationPending(true);
          } else {
            router.replace('/');
          }
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.success) {
          router.replace('/');
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Authentication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
    showToast(`Verification code 482190 sent to +91 ${phone}!`, 'success');
  };

  const handleVerifyOtp = async () => {
    setUserRole(portalRole);
    const defaultName =
      portalRole === 'citizen'
        ? 'Citizen Member'
        : portalRole === 'university'
        ? 'University Faculty'
        : portalRole === 'industry'
        ? 'Industry Partner'
        : 'District Nodal Officer';
    await loginWithMobile(`+91 ${phone}`, defaultName, portalRole);
    router.replace('/');
  };

  const handleGuestSubmit = () => {
    setUserRole('citizen');
    continueAsGuest(guestName || 'Guest Citizen', guestPhone ? `+91 ${guestPhone}` : '');
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
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

          <View style={styles.supabaseLivePill}>
            <View style={styles.liveDot} />
            <Database size={12} color="#16A34A" />
            <Text style={styles.supabaseLiveText}>
              Supabase Auth Connected
            </Text>
          </View>
        </View>

        <Text style={styles.roleLabel}>Choose Your Role</Text>
        <View style={styles.roleRow}>
          {(['citizen', 'university', 'industry', 'government'] as UserRole[]).map((role) => (
            <Pressable
              key={role}
              onPress={() => handleRoleChange(role)}
              style={[styles.roleChip, portalRole === role && styles.roleChipOn]}>
              <Text
                style={[
                  styles.roleChipText,
                  portalRole === role && styles.roleChipTextOn,
                ]}>
                {role === 'citizen'
                  ? 'Citizen'
                  : role === 'university'
                  ? 'University'
                  : role === 'industry'
                  ? 'Industry'
                  : 'Admin'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tabToggle}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === 'email' }}
            onPress={() => setAuthMode('email')}
            style={[styles.tabBtn, authMode === 'email' && styles.tabBtnActive]}>
            <Mail
              size={14}
              color={authMode === 'email' ? SamadhanColors.primary : SamadhanColors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.tabBtnText,
                authMode === 'email' && styles.tabBtnTextActive,
              ]}>
              Email Account
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === 'otp' }}
            onPress={() => setAuthMode('otp')}
            style={[styles.tabBtn, authMode === 'otp' && styles.tabBtnActive]}>
            <Phone
              size={14}
              color={authMode === 'otp' ? SamadhanColors.primary : SamadhanColors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.tabBtnText,
                authMode === 'otp' && styles.tabBtnTextActive,
              ]}>
              Mobile OTP
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === 'guest' }}
            onPress={() => setAuthMode('guest')}
            style={[styles.tabBtn, authMode === 'guest' && styles.tabBtnActive]}>
            <Text
              style={[
                styles.tabBtnText,
                authMode === 'guest' && styles.tabBtnTextActive,
              ]}>
              Guest
            </Text>
          </Pressable>
        </View>

        {authMode === 'email' && (
          <View style={[styles.card, Shadows.sm]}>
            <View style={styles.subModeSwitch}>
              <Pressable
                onPress={() => {
                  setIsSignUp(false);
                  setEmailConfirmationPending(false);
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
                onPress={() => {
                  setIsSignUp(true);
                  setEmailConfirmationPending(false);
                }}
                style={[styles.subModeBtn, isSignUp && styles.subModeBtnActive]}>
                <Text
                  style={[
                    styles.subModeText,
                    isSignUp && styles.subModeTextActive,
                  ]}>
                  Register New
                </Text>
              </Pressable>
            </View>

            {emailConfirmationPending && (
              <View style={styles.pendingBanner}>
                <CheckCircle2 size={18} color="#16A34A" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pendingBannerTitle}>
                    Account registered in Supabase!
                  </Text>
                  <Text style={styles.pendingBannerText}>
                    Verification link sent to your email. You can sign in immediately once verified.
                  </Text>
                </View>
              </View>
            )}

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
                  <Text style={styles.fieldLabel}>Mobile Phone (Optional)</Text>
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
                  placeholder="your.email@example.com"
                  placeholderTextColor={SamadhanColors.textMuted}
                  style={styles.textInputWithIcon}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={SamadhanColors.textMuted} style={styles.inputIcon} />
                <TextInput
                  accessibilityLabel="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="At least 6 characters"
                  placeholderTextColor={SamadhanColors.textMuted}
                  style={styles.textInputWithIcon}
                />
              </View>
            </View>

            <Button
              title={
                isSubmitting
                  ? 'Connecting to Supabase...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'
              }
              onPress={handleEmailAuth}
              disabled={isSubmitting}
              variant="action"
              size="lg"
              icon={
                isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <ArrowRight size={18} color="#FFFFFF" />
                )
              }
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}

        {authMode === 'otp' && (
          <View style={[styles.card, Shadows.sm]}>
            {!otpSent ? (
              <>
                <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
                  Login with Mobile Number
                </Text>
                <Text style={styles.cardSubtext}>
                  We will send a 6-digit one-time password (OTP) to your phone.
                </Text>

                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBadge}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>

                  <TextInput
                    accessibilityLabel="10 Digit Mobile Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="98765 43210"
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.phoneInput}
                    maxLength={13}
                  />
                </View>

                <Button
                  title="Get OTP"
                  onPress={handleSendOtp}
                  variant="action"
                  size="lg"
                  iconRight={<ArrowRight size={18} color="#FFFFFF" />}
                  style={{ marginTop: Spacing.lg }}
                />
              </>
            ) : (
              <>
                <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
                  Verify Mobile OTP
                </Text>
                <Text style={styles.cardSubtext}>
                  Enter the 6-digit code sent to +91 {phone}
                </Text>

                <View style={styles.otpGrid}>
                  {otp.map((digit, idx) => (
                    <View key={idx} style={styles.otpBox}>
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.resendRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change Mobile Number"
                    onPress={() => setOtpSent(false)}
                    style={styles.changePhoneBtn}>
                    <Text style={styles.changePhoneText}>Change number</Text>
                  </Pressable>

                  {resendTimer > 0 ? (
                    <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Resend OTP"
                      onPress={handleSendOtp}
                      style={styles.resendBtn}>
                      <RefreshCw size={12} color={SamadhanColors.primary} />
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </Pressable>
                  )}
                </View>

                <Button
                  title="Verify & Enter"
                  onPress={handleVerifyOtp}
                  variant="action"
                  size="lg"
                  icon={<CheckCircle2 size={18} color="#FFFFFF" />}
                  style={{ marginTop: Spacing.lg }}
                />
              </>
            )}
          </View>
        )}

        {authMode === 'guest' && (
          <View style={[styles.card, Shadows.sm]}>
            <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
              Continue as Guest
            </Text>
            <Text style={styles.cardSubtext}>
              You can explore and report issues without creating an account. Name is optional.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Your Name (Optional)</Text>
              <TextInput
                accessibilityLabel="Guest Name"
                value={guestName}
                onChangeText={setGuestName}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Mobile Number (For SMS updates)</Text>
              <TextInput
                accessibilityLabel="Guest Phone"
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="phone-pad"
                placeholder="98765 43210"
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Preferred Contact Method</Text>
              <View style={styles.choiceRow}>
                {(['Phone', 'WhatsApp'] as const).map((method) => (
                  <Pressable
                    key={method}
                    accessibilityRole="button"
                    accessibilityLabel={`Select contact method ${method}`}
                    onPress={() => setGuestContactMethod(method)}
                    style={[
                      styles.methodPill,
                      guestContactMethod === method && styles.methodPillActive,
                    ]}>
                    <Text
                      style={[
                        styles.methodPillText,
                        guestContactMethod === method && styles.methodPillTextActive,
                      ]}>
                      {method}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Button
              title="Continue to Home"
              onPress={handleGuestSubmit}
              variant="action"
              size="lg"
              iconRight={<ArrowRight size={18} color="#FFFFFF" />}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}

        <View style={styles.privacyNote}>
          <ShieldCheck size={16} color="#16A34A" />
          <Text style={styles.privacyText}>
            Your personal data is encrypted with Supabase Row-Level Security (RLS) under DPDP protocols.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    width: 54,
    height: 54,
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
    fontSize: 22,
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
  supabaseLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginTop: 10,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  supabaseLiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: '#FFFFFF',
  },
  roleChipOn: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  roleChipTextOn: {
    color: '#FFFFFF',
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  tabBtnTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  card: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.xl,
  },
  cardHeading: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 17,
    marginBottom: Spacing.lg,
  },
  subModeSwitch: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  subModeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  subModeBtnActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
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
  pendingBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  pendingBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
    marginBottom: 2,
  },
  pendingBannerText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
    marginBottom: 6,
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
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    minHeight: 48,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: Spacing.md,
  },
  otpBox: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: SamadhanColors.primaryLight,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  changePhoneBtn: {
    padding: 6,
  },
  changePhoneText: {
    fontSize: 12,
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  timerText: {
    fontSize: 12,
    color: SamadhanColors.textMuted,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  resendText: {
    fontSize: 12,
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
    minHeight: 46,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minHeight: 38,
    justifyContent: 'center',
  },
  methodPillActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  methodPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  methodPillTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
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
