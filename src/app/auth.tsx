import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Phone,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  RefreshCw,
  Mail,
  HelpCircle,
  CheckCircle2,
  Lock,
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
  const { loginWithMobile, continueAsGuest, language, fontScale, showToast, setUserRole } = useApp();
  const [portalRole, setPortalRole] = useState<UserRole>('citizen');

  // Authentication Mode: 'otp' | 'email' | 'guest'
  const [authMode, setAuthMode] = useState<'otp' | 'email' | 'guest'>('otp');

  // Mobile + OTP state
  const [phone, setPhone] = useState('98351 44210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['4', '8', '2', '1', '9', '0']);
  const [resendTimer, setResendTimer] = useState(30);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Guest fields
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestContactMethod, setGuestContactMethod] = useState<'Phone' | 'WhatsApp'>('Phone');

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      showToast(
        language === 'hi'
          ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.',
        'error'
      );
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
    showToast(
      language === 'hi'
        ? `ओटीपी 482190 आपके मोबाइल नंबर पर भेजा गया!`
        : `OTP 482190 sent to +91 ${phone}!`,
      'success'
    );
  };

  const handleVerifyOtp = () => {
    setUserRole(portalRole);
    loginWithMobile(`+91 ${phone}`, portalRole === 'citizen' ? 'Sunita Devi' : portalRole === 'university' ? 'Dr. Anjali Singh' : portalRole === 'industry' ? 'CSR Lead, Tata Steel' : 'District Nodal Officer');
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
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>SJ</Text>
          </View>
          <Text style={[styles.brandTitle, { fontSize: 24 * fontScale }]}>
            {language === 'hi' ? 'संवाद झारखंड' : 'Samvad Jharkhand'}
          </Text>
          <Text style={styles.brandSubtitle}>
            {language === 'hi'
              ? 'नागरिक से परिसर तक सामाजिक नवाचार पोर्टल'
              : 'Citizen-to-campus innovation portal for Jharkhand'}
          </Text>
        </View>

        <Text style={styles.roleLabel}>Enter as</Text>
        <View style={styles.roleRow}>
          {(['citizen', 'university', 'industry', 'government'] as UserRole[]).map((role) => (
            <Pressable key={role} onPress={() => setPortalRole(role)} style={[styles.roleChip, portalRole === role && styles.roleChipOn]}>
              <Text style={[styles.roleChipText, portalRole === role && styles.roleChipTextOn]}>
                {role === 'citizen' ? 'Citizen' : role === 'university' ? 'University' : role === 'industry' ? 'Industry' : 'Admin'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Switch: Mobile OTP / Continue as Guest */}
        <View style={styles.tabToggle}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === 'otp' }}
            onPress={() => setAuthMode('otp')}
            style={[
              styles.tabBtn,
              authMode === 'otp' && styles.tabBtnActive,
            ]}>
            <Text
              style={[
                styles.tabBtnText,
                authMode === 'otp' && styles.tabBtnTextActive,
              ]}>
              {language === 'hi' ? 'मोबाइल नंबर व OTP' : 'Mobile & OTP'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: authMode === 'guest' }}
            onPress={() => setAuthMode('guest')}
            style={[
              styles.tabBtn,
              authMode === 'guest' && styles.tabBtnActive,
            ]}>
            <Text
              style={[
                styles.tabBtnText,
                authMode === 'guest' && styles.tabBtnTextActive,
              ]}>
              {language === 'hi' ? 'अतिथि (Guest)' : 'Continue as Guest'}
            </Text>
          </Pressable>
        </View>

        {/* ============ MODE 1: MOBILE OTP ============ */}
        {authMode === 'otp' && (
          <View style={[styles.card, Shadows.sm]}>
            {!otpSent ? (
              <>
                <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
                  {language === 'hi' ? 'मोबाइल नंबर से लॉगिन करें' : 'Login with Mobile Number'}
                </Text>
                <Text style={styles.cardSubtext}>
                  {language === 'hi'
                    ? 'हम आपके नंबर पर 6 अंकों का एकमुश्त पासवर्ड (OTP) भेजेंगे।'
                    : 'We will send a 6-digit one-time password (OTP) to your phone.'}
                </Text>

                {/* Country code + Mobile field */}
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
                  title={language === 'hi' ? 'OTP प्राप्त करें' : 'Get OTP'}
                  onPress={handleSendOtp}
                  variant="action"
                  size="lg"
                  iconRight={<ArrowRight size={18} color="#FFFFFF" />}
                  style={{ marginTop: Spacing.lg }}
                />
              </>
            ) : (
              /* OTP VERIFICATION STEP */
              <>
                <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
                  {language === 'hi' ? 'OTP सत्यापन करें' : 'Verify Mobile OTP'}
                </Text>
                <Text style={styles.cardSubtext}>
                  {language === 'hi'
                    ? `+91 ${phone} पर भेजा गया 6 अंकों का कोड दर्ज करें`
                    : `Enter the 6-digit code sent to +91 ${phone}`}
                </Text>

                {/* OTP Input Boxes (prefilled for instant mock test) */}
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
                    <Text style={styles.changePhoneText}>
                      {language === 'hi' ? 'नंबर बदलें' : 'Change number'}
                    </Text>
                  </Pressable>

                  {resendTimer > 0 ? (
                    <Text style={styles.timerText}>
                      {language === 'hi'
                        ? `${resendTimer} सेकंड में दोबारा भेजें`
                        : `Resend in ${resendTimer}s`}
                    </Text>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Resend OTP"
                      onPress={handleSendOtp}
                      style={styles.resendBtn}>
                      <RefreshCw size={12} color={SamadhanColors.primary} />
                      <Text style={styles.resendText}>
                        {language === 'hi' ? 'दोबारा भेजें' : 'Resend OTP'}
                      </Text>
                    </Pressable>
                  )}
                </View>

                <Button
                  title={language === 'hi' ? 'सत्यापित करें व आगे बढ़ें' : 'Verify & Enter'}
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

        {/* ============ MODE 2: GUEST USER ============ */}
        {authMode === 'guest' && (
          <View style={[styles.card, Shadows.sm]}>
            <Text style={[styles.cardHeading, { fontSize: 16 * fontScale }]}>
              {language === 'hi' ? 'अतिथि के रूप में जारी रखें' : 'Continue as Guest'}
            </Text>
            <Text style={styles.cardSubtext}>
              {language === 'hi'
                ? 'आप बिना लॉगिन किए भी समस्या दर्ज कर सकते हैं। प्रगति अपडेट के लिए संपर्क जानकारी वैकल्पिक है।'
                : 'You can report issues as a guest. Name and contact details are optional for tracking.'}
            </Text>

            {/* Optional Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {language === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Name (Optional)'}
              </Text>
              <TextInput
                accessibilityLabel="Guest Name"
                value={guestName}
                onChangeText={setGuestName}
                placeholder={language === 'hi' ? 'उदा. राजेश कुमार' : 'e.g., Rajesh Kumar'}
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.textInput}
              />
            </View>

            {/* Optional Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {language === 'hi' ? 'मोबाइल नंबर (अपडेट पाने हेतु)' : 'Mobile Number (For progress SMS)'}
              </Text>
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

            {/* Contact Method */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {language === 'hi' ? 'संपर्क का पसंदीदा माध्यम' : 'Preferred Contact Method'}
              </Text>
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
              title={language === 'hi' ? 'अतिथि के रूप में शुरू करें' : 'Continue to Home'}
              onPress={handleGuestSubmit}
              variant="action"
              size="lg"
              iconRight={<ArrowRight size={18} color="#FFFFFF" />}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}

        {/* Privacy and DPDP Notice */}
        <View style={styles.privacyNote}>
          <ShieldCheck size={16} color="#16A34A" />
          <Text style={styles.privacyText}>
            {language === 'hi'
              ? 'आपकी व्यक्तिगत जानकारी डेटा संरक्षण कानून के अंतर्गत सुरक्षित है। सार्वजनिक मंच पर आपका नंबर नहीं दिखेगा।'
              : 'Your personal phone number is encrypted and protected. It is never displayed publicly.'}
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
    marginVertical: Spacing.xl,
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
  inputGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
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
