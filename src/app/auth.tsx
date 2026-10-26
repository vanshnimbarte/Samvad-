import React, { useState } from 'react';
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
  Mail,
  Phone,
  Lock,
  User,
  GraduationCap,
  Building,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react-native';
import { useApp, UserRole } from '@/context/AppContext';
import { SamadhanColors, Spacing, Radius, Shadows } from '@/constants/samadhan-theme';

const UNIVERSITIES = [
  'IIT (ISM) Dhanbad',
  'BIT Mesra',
  'NIT Jamshedpur',
  'Ranchi University',
  'Other University',
];

export default function AuthScreen() {
  const router = useRouter();
  const {
    signInWithEmail,
    signUpWithEmail,
    loginWithMobile,
    setUserRole,
    showToast,
  } = useApp();

  const [portalRole, setPortalRole] = useState<UserRole>('university');
  const [authMode, setAuthMode] = useState<'email' | 'mobile'>('email');
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName] = useState('Prof. Rajesh Sharma');
  const [universityName, setUniversityName] = useState('IIT (ISM) Dhanbad');
  const [email, setEmail] = useState('rajesh.sharma@iitism.ac.in');
  const [phone, setPhone] = useState('7972671490');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setPortalRole(role);
    if (role === 'university') {
      setFullName('Prof. Rajesh Sharma');
      setEmail('rajesh.sharma@iitism.ac.in');
    } else if (role === 'citizen') {
      setFullName('Ramesh Kumar');
      setEmail('ramesh.kumar@gmail.com');
    } else if (role === 'industry') {
      setFullName('Alok Verma');
      setEmail('alok.verma@tatasteel.com');
    } else {
      setFullName('District Nodal Officer');
      setEmail('admin@jharkhand.gov.in');
    }
  };

  const getOrganization = () => {
    if (portalRole === 'university') return universityName;
    if (portalRole === 'industry') return 'Industry Partner';
    if (portalRole === 'government') return 'Jharkhand Administration';
    return 'Citizen Member';
  };

  const handleAuthSubmit = async () => {
    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const org = getOrganization();

      if (authMode === 'mobile') {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          showToast('Please enter a valid 10-digit mobile number.', 'error');
          setIsSubmitting(false);
          return;
        }
        await loginWithMobile(`+91 ${cleanPhone}`, fullName.trim(), portalRole, org);
        router.replace('/');
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        showToast('Please enter a valid email address.', 'error');
        setIsSubmitting(false);
        return;
      }

      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        setIsSubmitting(false);
        return;
      }

      if (isSignUp) {
        const res = await signUpWithEmail(email, password, {
          fullName: fullName.trim(),
          role: portalRole,
          organization: org,
          phone: phone.trim() ? `+91 ${phone.replace(/\D/g, '')}` : '',
        });
        if (res.success) {
          router.replace('/');
        }
      } else {
        const res = await signInWithEmail(email, password, {
          fullName: fullName.trim(),
          role: portalRole,
          organization: org,
        });
        if (res.success) {
          router.replace('/');
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      const isUni = role === 'university';
      const name = isUni
        ? 'Prof. Rajesh Sharma'
        : role === 'citizen'
        ? 'Ramesh Kumar'
        : role === 'industry'
        ? 'Alok Verma'
        : 'District Nodal Officer';

      const org = isUni ? 'IIT (ISM) Dhanbad' : role === 'industry' ? 'Tata Steel CSR' : undefined;
      const quickEmail = `${role}@samvad.jharkhand.gov.in`;

      await signInWithEmail(quickEmail, 'Jharkhand@123', {
        fullName: name,
        role,
        organization: org,
      });
      router.replace('/');
    } catch (err: any) {
      showToast(err?.message || 'Quick login error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>SJ</Text>
          </View>
          <Text style={styles.title}>Samvad Jharkhand</Text>
          <Text style={styles.subtitle}>
            Societal Innovation Portal connecting Citizens, Universities, and Industry
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Select Your Role</Text>
          <View style={styles.roleGrid}>
            {(['university', 'citizen', 'industry', 'government'] as UserRole[]).map((role) => {
              const active = portalRole === role;
              return (
                <Pressable
                  key={role}
                  onPress={() => handleRoleChange(role)}
                  style={[styles.roleCard, active && styles.roleCardActive]}>
                  {role === 'university' && (
                    <GraduationCap size={20} color={active ? '#FFFFFF' : SamadhanColors.primary} />
                  )}
                  {role === 'citizen' && (
                    <User size={20} color={active ? '#FFFFFF' : SamadhanColors.primary} />
                  )}
                  {role === 'industry' && (
                    <Building size={20} color={active ? '#FFFFFF' : SamadhanColors.primary} />
                  )}
                  {role === 'government' && (
                    <Shield size={20} color={active ? '#FFFFFF' : SamadhanColors.primary} />
                  )}
                  <Text style={[styles.roleCardText, active && styles.roleCardTextActive]}>
                    {role === 'university'
                      ? 'University'
                      : role === 'citizen'
                      ? 'Citizen'
                      : role === 'industry'
                      ? 'Industry'
                      : 'Admin'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.quickAccessBox}>
            <Text style={styles.quickAccessTitle}>Instant 1-Tap Login</Text>
            <View style={styles.quickBtnRow}>
              <Pressable
                onPress={() => handleQuickLogin('university')}
                style={[styles.quickBtn, styles.quickBtnUni]}>
                <GraduationCap size={16} color="#FFFFFF" />
                <Text style={styles.quickBtnText}>University Login</Text>
              </Pressable>
              <Pressable
                onPress={() => handleQuickLogin('citizen')}
                style={[styles.quickBtn, styles.quickBtnCitizen]}>
                <User size={16} color="#FFFFFF" />
                <Text style={styles.quickBtnText}>Citizen Login</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CUSTOM SIGN IN</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.modeTabs}>
            <Pressable
              onPress={() => setAuthMode('email')}
              style={[styles.modeTab, authMode === 'email' && styles.modeTabActive]}>
              <Mail size={16} color={authMode === 'email' ? SamadhanColors.primary : SamadhanColors.textMuted} />
              <Text style={[styles.modeTabText, authMode === 'email' && styles.modeTabTextActive]}>
                Email Account
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAuthMode('mobile')}
              style={[styles.modeTab, authMode === 'mobile' && styles.modeTabActive]}>
              <Phone size={16} color={authMode === 'mobile' ? SamadhanColors.primary : SamadhanColors.textMuted} />
              <Text style={[styles.modeTabText, authMode === 'mobile' && styles.modeTabTextActive]}>
                Mobile Number
              </Text>
            </Pressable>
          </View>

          {authMode === 'email' && (
            <View style={styles.actionToggleRow}>
              <Pressable
                onPress={() => setIsSignUp(false)}
                style={[styles.actionToggleBtn, !isSignUp && styles.actionToggleBtnActive]}>
                <Text style={[styles.actionToggleText, !isSignUp && styles.actionToggleTextActive]}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsSignUp(true)}
                style={[styles.actionToggleBtn, isSignUp && styles.actionToggleBtnActive]}>
                <Text style={[styles.actionToggleText, isSignUp && styles.actionToggleTextActive]}>
                  Register New
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputBox}>
              <User size={18} color={SamadhanColors.textMuted} style={styles.fieldIcon} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.textInput}
              />
            </View>
          </View>

          {portalRole === 'university' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Select University</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {UNIVERSITIES.map((uni) => {
                  const sel = universityName === uni;
                  return (
                    <Pressable
                      key={uni}
                      onPress={() => setUniversityName(uni)}
                      style={[styles.uniChip, sel && styles.uniChipSelected]}>
                      <Text style={[styles.uniChipText, sel && styles.uniChipTextSelected]}>
                        {uni}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {authMode === 'email' ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputBox}>
                  <Mail size={18} color={SamadhanColors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter email address"
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <Lock size={18} color={SamadhanColors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Enter password (min 6 chars)"
                    placeholderTextColor={SamadhanColors.textMuted}
                    style={styles.textInput}
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputBox}>
                <Phone size={18} color={SamadhanColors.textMuted} style={styles.fieldIcon} />
                <Text style={styles.prefixText}>+91</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="10-digit mobile number"
                  placeholderTextColor={SamadhanColors.textMuted}
                  style={styles.textInput}
                />
              </View>
            </View>
          )}

          <Pressable
            onPress={handleAuthSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {authMode === 'mobile'
                    ? 'Continue with Mobile'
                    : isSignUp
                    ? 'Create Account & Enter'
                    : 'Sign In to Portal'}
                </Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </>
            )}
          </Pressable>

          <View style={styles.footerSecurity}>
            <CheckCircle size={14} color="#16A34A" />
            <Text style={styles.footerSecurityText}>
              Secure role authentication with instant portal access
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleCardActive: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  roleCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  roleCardTextActive: {
    color: '#FFFFFF',
  },
  quickAccessBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: Spacing.lg,
  },
  quickAccessTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  quickBtnUni: {
    backgroundColor: '#0B4619',
  },
  quickBtnCitizen: {
    backgroundColor: '#F97316',
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    letterSpacing: 0.5,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: SamadhanColors.textMuted,
  },
  modeTabTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  actionToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.sm,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionToggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  actionToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  actionToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  actionToggleTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  fieldIcon: {
    marginRight: 8,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: SamadhanColors.textPrimary,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  uniChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  uniChipSelected: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  uniChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  uniChipTextSelected: {
    color: '#15803D',
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SamadhanColors.action,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  footerSecurityText: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
  },
});
