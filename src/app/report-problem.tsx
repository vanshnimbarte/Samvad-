import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Search,
  AlertCircle,
  ShieldCheck,
  Edit3,
  GraduationCap,
  HeartPulse,
  Droplet,
  Sprout,
  Trash2,
  Navigation,
  Trees,
  Accessibility,
  Users,
  Laptop,
  Building2,
  HelpCircle,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react-native';

import { Button } from '@/components/common/Button';
import { VoiceInputButton } from '@/components/common/VoiceInputButton';
import { MediaUploader, UploadedMediaItem } from '@/components/common/MediaUploader';
import { LocationPicker, SelectedLocation } from '@/components/common/LocationPicker';
import { useApp } from '@/context/AppContext';
import {
  CIVIC_CATEGORIES,
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function ReportProblemScreen() {
  const router = useRouter();
  const {
    language,
    fontScale,
    t,
    submitNewReport,
    saveNewDraft,
    user,
    showToast,
  } = useApp();

  // Wizard Step State (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('water');
  const [categorySearch, setCategorySearch] = useState('');
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [location, setLocation] = useState<SelectedLocation>({
    district: user.district || 'Ranchi',
    block: user.block || 'Ormanjhi',
    villageOrWard: 'Chutupalu Panchayat',
    address: 'Near Govt Primary School, Ormanjhi',
    latitude: 23.4789,
    longitude: 85.4789,
    accuracyMeters: 6,
    isGps: true,
  });
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>('high');
  const [affectedCount, setAffectedCount] = useState('150');
  const [affectedGroups, setAffectedGroups] = useState<string[]>([
    'Children',
    'Women',
    'Entire community',
  ]);
  const [recurring, setRecurring] = useState(true);
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | 'In-Person'>('Phone');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper title suggestions
  const suggestedTitles =
    language === 'hi'
      ? [
          'प्राथमिक विद्यालय के पास खराब हैंडपंप',
          'गांव की मुख्य सड़क पर बारिश का जलभराव',
          'अस्पताल के निकट बंद सोलर स्ट्रीटलाइट',
          'मोहल्ले में कचरे का अंबार और दुर्गंध',
        ]
      : [
          'Broken handpump near the primary school',
          'Flooded village road during monsoon',
          'Missing streetlights near health center',
          'Irregular garbage dumping in residential area',
        ];

  // Render category icons dynamically
  const getCategoryIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={24} color={color} />;
      case 'HeartPulse':
        return <HeartPulse size={24} color={color} />;
      case 'Droplet':
        return <Droplet size={24} color={color} />;
      case 'Sprout':
        return <Sprout size={24} color={color} />;
      case 'Trash2':
        return <Trash2 size={24} color={color} />;
      case 'Navigation':
        return <Navigation size={24} color={color} />;
      case 'Trees':
        return <Trees size={24} color={color} />;
      case 'Accessibility':
        return <Accessibility size={24} color={color} />;
      case 'Users':
        return <Users size={24} color={color} />;
      case 'Laptop':
        return <Laptop size={24} color={color} />;
      case 'Building2':
        return <Building2 size={24} color={color} />;
      default:
        return <HelpCircle size={24} color={color} />;
    }
  };

  const filteredCategories = CIVIC_CATEGORIES.filter((c) => {
    const q = categorySearch.toLowerCase();
    return (
      c.nameEn.toLowerCase().includes(q) ||
      c.nameHi.toLowerCase().includes(q) ||
      c.descriptionEn.toLowerCase().includes(q)
    );
  });

  const toggleAffectedGroup = (group: string) => {
    if (affectedGroups.includes(group)) {
      setAffectedGroups(affectedGroups.filter((g) => g !== group));
    } else {
      setAffectedGroups([...affectedGroups, group]);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim() || title.trim().length < 5) {
        newErrors.title =
          language === 'hi'
            ? 'कृपया समस्या का शीर्षक कम से कम 5 अक्षरों में लिखें।'
            : 'Please enter a title of at least 5 characters.';
      }
      if (!description.trim() || description.trim().length < 15) {
        newErrors.description =
          language === 'hi'
            ? 'कृपया समस्या का विवरण कम से कम 15 अक्षरों में विस्तार से बताएं।'
            : 'Please describe the problem in more detail (min 15 chars).';
      }
    }

    if (step === 2) {
      if (!categoryId) {
        newErrors.category =
          language === 'hi' ? 'कृपया एक श्रेणी चुनें।' : 'Please select a category.';
      }
    }

    if (step === 5) {
      if (!consentGiven) {
        newErrors.consent =
          language === 'hi'
            ? 'कृपया विवरण की सत्यता संबंधी सहमति दें।'
            : 'Please confirm that the information provided is accurate.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(6, s + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  const handleSaveDraft = () => {
    saveNewDraft({
      title: title || 'Draft Problem Report',
      description,
      categoryId,
      urgency,
      district: location.district,
      block: location.block,
      villageOrWard: location.villageOrWard,
      address: location.address,
      affectedCount: parseInt(affectedCount, 10) || 10,
      affectedGroups,
      recurring,
      isAnonymous,
      contactMethod,
      mediaCount: mediaList.length,
    });
    router.push('/my-reports');
  };

  const handleSubmit = () => {
    if (!consentGiven) {
      setErrors({
        consent:
          language === 'hi'
            ? 'कृपया विवरण की सत्यता संबंधी सहमति दें।'
            : 'Please confirm that the information provided is accurate.',
      });
      return;
    }

    const newId = submitNewReport({
      titleEn: title,
      titleHi: title,
      descriptionEn: description,
      descriptionHi: description,
      categoryId,
      urgency,
      location: {
        district: location.district,
        block: location.block,
        villageOrWard: location.villageOrWard,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      affectedCount: parseInt(affectedCount, 10) || 50,
      affectedGroups,
      recurring,
      submittedBy: {
        name: isAnonymous ? 'Anonymous Citizen' : user.name,
        role: isAnonymous ? 'Concerned Citizen' : user.communityRole,
        isAnonymous,
        contactMethod,
      },
      media: mediaList.map((m) => ({
        type: m.type === 'video' ? 'video' : 'image',
        url: m.uri,
        captionEn: m.fileName,
        captionHi: m.fileName,
        fileSizeMb: m.compressedSizeMb,
      })),
    });

    router.replace(`/report-success?id=${newId}`);
  };

  const stepLabels = [
    language === 'hi' ? 'विवरण' : 'Describe',
    language === 'hi' ? 'श्रेणी' : 'Category',
    language === 'hi' ? 'साक्ष्य' : 'Evidence',
    language === 'hi' ? 'स्थान' : 'Location',
    language === 'hi' ? 'प्रभाव' : 'Details',
    language === 'hi' ? 'समीक्षा' : 'Review',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.navIconBtn}>
          <ArrowLeft size={22} color={SamadhanColors.textPrimary} />
        </Pressable>

        <View style={styles.topBarCenter}>
          <Text style={styles.wizardTitle}>
            {language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}
          </Text>
          <Text style={styles.stepCounter}>
            {t('step')} {currentStep} {t('of')} 6: {stepLabels[currentStep - 1]}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save as Draft"
          onPress={handleSaveDraft}
          style={styles.saveDraftBtn}>
          <Bookmark size={16} color={SamadhanColors.primary} />
          <Text style={styles.saveDraftText}>
            {language === 'hi' ? 'ड्राफ्ट' : 'Draft'}
          </Text>
        </Pressable>
      </View>

      {/* Progress Bar with 6 segments */}
      <View style={styles.progressTrack}>
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <View
            key={s}
            style={[
              styles.progressSegment,
              s <= currentStep && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* ================= STEP 1: DESCRIBE ================= */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi'
                ? 'आपने क्या समस्या देखी?'
                : 'What problem did you notice?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'स्पष्ट और सरल भाषा में समस्या बताएं ताकि संबंधित विभाग तुरंत समझ सकें।'
                : 'Explain what is happening, where it is happening, and who is affected.'}
            </Text>

            {/* Quick Demo Autofill Button for SIH Video */}
            <Pressable
              onPress={() => {
                setTitle(language === 'hi' ? 'प्राथमिक विद्यालय के निकट खराब हैंडपंप' : 'Broken handpump near Ormanjhi Primary School');
                setDescription(language === 'hi'
                  ? 'स्कूल परिसर में एकमात्र पेयजल हैंडपंप 3 सप्ताह से रेत फेंक रहा है और बंद पड़ा है। 200 से अधिक छात्र व ग्रामीण दूर से पानी लाने को विवश हैं।'
                  : 'The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks. Over 200 students and villagers are affected.');
                setCategoryId('water');
                setUrgency('high');
                setAffectedCount('220');
                showToast(language === 'hi' ? 'डेमो शिकायत विवरण भर दिया गया!' : 'Demo grievance details autofilled!', 'info');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#EFF6FF',
                borderWidth: 1,
                borderColor: '#BFDBFE',
                borderRadius: Radius.md,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: Spacing.md,
                alignSelf: 'flex-start',
              }}>
              <Sparkles size={14} color={SamadhanColors.primary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: SamadhanColors.primary }}>
                {language === 'hi' ? '✨ डेमो समस्या स्वतः भरें (SIH वीडियो)' : '✨ Autofill Demo Grievance (SIH Video)'}
              </Text>
            </Pressable>

            {/* Title Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {language === 'hi' ? 'समस्या का शीर्षक' : 'Problem Title'} *
              </Text>
              <TextInput
                accessibilityLabel="Problem Title Input"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder={
                  language === 'hi'
                    ? 'उदा. प्राथमिक विद्यालय के पास टूटा हुआ हैंडपंप'
                    : 'e.g., Broken handpump near the primary school'
                }
                placeholderTextColor={SamadhanColors.textMuted}
                style={[styles.textInput, errors.title && styles.inputError]}
                maxLength={90}
              />
              <View style={styles.fieldMetaRow}>
                {errors.title ? (
                  <Text style={styles.errorText}>{errors.title}</Text>
                ) : (
                  <Text style={styles.helperText}>
                    {language === 'hi' ? 'छोटा और सटीक शीर्षक दें' : 'Give a clear, specific title'}
                  </Text>
                )}
                <Text style={styles.charCount}>{title.length}/90</Text>
              </View>

              {/* Suggested Titles */}
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionHeader}>
                  <Sparkles size={12} color={SamadhanColors.primary} />{' '}
                  {language === 'hi' ? 'सुझाए गए शीर्षक:' : 'Suggested titles:'}
                </Text>
                <View style={styles.suggestionChips}>
                  {suggestedTitles.map((st, i) => (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityLabel={`Use title suggestion: ${st}`}
                      onPress={() => setTitle(st)}
                      style={styles.suggestionChip}>
                      <Text style={styles.suggestionChipText}>{st}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Voice Input Button */}
            <VoiceInputButton
              onTranscriptionAvailable={(text) => {
                setDescription((prev) => (prev ? `${prev} ${text}` : text));
              }}
            />

            {/* Description Field */}
            <View style={[styles.inputGroup, { marginTop: Spacing.md }]}>
              <Text style={styles.label}>
                {language === 'hi' ? 'विस्तृत विवरण' : 'Problem Description'} *
              </Text>
              <TextInput
                accessibilityLabel="Problem Description Input"
                value={description}
                onChangeText={(t) => {
                  setDescription(t);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder={
                  language === 'hi'
                    ? 'विस्तार से समझाएं कि क्या हो रहा है, यह कब से है और नागरिकों को क्या परेशानी हो रही है...'
                    : 'Explain what is happening, how long it has been broken, and how community members are affected...'
                }
                placeholderTextColor={SamadhanColors.textMuted}
                style={[styles.textArea, errors.description && styles.inputError]}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={500}
              />
              <View style={styles.fieldMetaRow}>
                {errors.description ? (
                  <Text style={styles.errorText}>{errors.description}</Text>
                ) : (
                  <Text style={styles.helperText}>
                    {language === 'hi'
                      ? 'कम से कम 15 अक्षर आवश्यक हैं'
                      : 'Minimum 15 characters required'}
                  </Text>
                )}
                <Text style={styles.charCount}>{description.length}/500</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= STEP 2: CATEGORY ================= */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi'
                ? 'यह किस प्रकार की समस्या है?'
                : 'What type of problem is this?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'सही श्रेणी चुनने से रिपोर्ट सीधे संबंधित विभाग तक पहुंचती है।'
                : 'Selecting the right category routes your issue to the correct line department.'}
            </Text>

            {/* Category Search Input */}
            <View style={styles.searchBox}>
              <Search size={18} color={SamadhanColors.textMuted} />
              <TextInput
                accessibilityLabel="Search categories"
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholder={
                  language === 'hi'
                    ? 'श्रेणी खोजें (उदा. पानी, सड़क, स्कूल)...'
                    : 'Search categories (e.g., water, road, school)...'
                }
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.searchInput}
              />
            </View>

            {/* 12 Selectable Category Cards */}
            <View style={styles.categoryGrid}>
              {filteredCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Category: ${cat.nameEn}`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setCategoryId(cat.id)}
                    style={[
                      styles.categoryCard,
                      isSelected && [
                        styles.categoryCardSelected,
                        { borderColor: cat.color },
                      ],
                    ]}>
                    <View
                      style={[
                        styles.categoryIconCircle,
                        { backgroundColor: cat.badgeBg },
                      ]}>
                      {getCategoryIcon(cat.iconName, cat.color)}
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && { color: cat.color, fontWeight: '800' },
                      ]}>
                      {language === 'hi' ? cat.nameHi : cat.nameEn}
                    </Text>

                    <Text style={styles.categoryDesc} numberOfLines={2}>
                      {cat.descriptionEn}
                    </Text>

                    {isSelected && (
                      <View
                        style={[
                          styles.selectedCheckBadge,
                          { backgroundColor: cat.color },
                        ]}>
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= STEP 3: EVIDENCE ================= */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi'
                ? 'क्या आप कोई फोटो या वीडियो जोड़ सकते हैं?'
                : 'Can you share any evidence?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'फोटो या वीडियो से अधिकारियों को समस्या तुरंत प्रमाणित करने में मदद मिलती है।'
                : 'Evidence accelerates validation. Images are auto-compressed for low networks.'}
            </Text>

            <MediaUploader
              mediaList={mediaList}
              onChange={setMediaList}
              onSkip={() => setCurrentStep(4)}
            />
          </View>
        )}

        {/* ================= STEP 4: LOCATION ================= */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi' ? 'समस्या कहां स्थित है?' : 'Where is the problem?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'सटीक स्थान या निकटतम पहचान चिह्न दें ताकि दल मौके पर पहुंच सके।'
                : 'Provide exact GPS coordinates or select your district, block, and ward.'}
            </Text>

            <LocationPicker value={location} onChange={setLocation} />
          </View>
        )}

        {/* ================= STEP 5: DETAILS & IMPACT ================= */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi'
                ? 'प्रभाव को समझने में हमारी सहायता करें'
                : 'Help us understand the impact'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'गंभीरता और प्रभावित लोगों की संख्या से प्राथमिकता तय करने में मदद मिलती है।'
                : 'Urgency and affected citizen counts help prioritize resources on the ground.'}
            </Text>

            {/* Urgency Selector */}
            <Text style={styles.fieldLabel}>
              {language === 'hi' ? 'यह समस्या कितनी गंभीर / अत्यावश्यक है?' : 'How urgent is this problem?'} *
            </Text>
            <View style={styles.urgencyGrid}>
              {[
                { key: 'low', labelEn: 'Low', labelHi: 'सामान्य', color: '#0284C7' },
                { key: 'medium', labelEn: 'Medium', labelHi: 'मध्यम', color: '#D97706' },
                { key: 'high', labelEn: 'High', labelHi: 'गंभीर', color: '#EA580C' },
                { key: 'emergency', labelEn: 'Emergency', labelHi: 'आपातकालीन', color: '#DC2626' },
              ].map((u) => (
                <Pressable
                  key={u.key}
                  accessibilityRole="button"
                  accessibilityLabel={`Urgency level: ${u.labelEn}`}
                  onPress={() => setUrgency(u.key as any)}
                  style={[
                    styles.urgencyPill,
                    urgency === u.key && [
                      styles.urgencyPillActive,
                      { backgroundColor: u.color, borderColor: u.color },
                    ],
                  ]}>
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === u.key && styles.urgencyTextActive,
                    ]}>
                    {language === 'hi' ? u.labelHi : u.labelEn}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Affected Count */}
            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={styles.fieldLabel}>
                {language === 'hi'
                  ? 'लगभग कितने लोग प्रभावित हैं?'
                  : 'How many people are affected?'}
              </Text>
              <TextInput
                accessibilityLabel="Number of people affected"
                value={affectedCount}
                onChangeText={setAffectedCount}
                keyboardType="numeric"
                placeholder="e.g., 150"
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.textInput}
              />
            </View>

            {/* Who is affected */}
            <View style={[styles.inputGroup, { marginTop: Spacing.md }]}>
              <Text style={styles.fieldLabel}>
                {language === 'hi' ? 'कौन-कौन प्रभावित हैं?' : 'Who is affected?'}
              </Text>
              <View style={styles.checkboxGrid}>
                {[
                  'Children',
                  'Farmers',
                  'Women',
                  'Older adults',
                  'People with disabilities',
                  'Entire community',
                ].map((grp) => {
                  const isChecked = affectedGroups.includes(grp);
                  return (
                    <Pressable
                      key={grp}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isChecked }}
                      onPress={() => toggleAffectedGroup(grp)}
                      style={[
                        styles.checkboxItem,
                        isChecked && styles.checkboxItemActive,
                      ]}>
                      <View
                        style={[
                          styles.checkSquare,
                          isChecked && styles.checkSquareActive,
                        ]}>
                        {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          isChecked && styles.checkboxLabelActive,
                        ]}>
                        {grp}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Recurring Problem Toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  {language === 'hi' ? 'क्या यह बार-बार होने वाली समस्या है?' : 'Is this a recurring problem?'}
                </Text>
                <Text style={styles.toggleDesc}>
                  {language === 'hi'
                    ? 'हर साल या बार-बार दोहराई जाती है'
                    : 'Happens every monsoon, seasonal, or persists after temporary fixes'}
                </Text>
              </View>
              <Switch
                value={recurring}
                onValueChange={setRecurring}
                trackColor={{ false: '#CBD5E1', true: SamadhanColors.primary }}
              />
            </View>

            {/* Anonymous Toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  {language === 'hi' ? 'गुमनाम रूप से दर्ज करें' : 'Submit Anonymously'}
                </Text>
                <Text style={styles.toggleDesc}>
                  {language === 'hi'
                    ? 'आपका नाम व संपर्क सार्वजनिक रूप से प्रदर्शित नहीं होगा।'
                    : 'Your name will not be shown publicly on community boards.'}
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#CBD5E1', true: SamadhanColors.action }}
              />
            </View>

            {/* Consent Checkbox */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consentGiven }}
              onPress={() => setConsentGiven(!consentGiven)}
              style={styles.consentRow}>
              <View
                style={[
                  styles.checkSquare,
                  consentGiven && styles.checkSquareActive,
                ]}>
                {consentGiven && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.consentText}>
                {language === 'hi'
                  ? 'मैं प्रमाणित करता/करती हूँ कि दी गई जानकारी सत्य है और समाधान सहायता हेतु साझा की जा सकती है।'
                  : 'I confirm that the details provided are accurate and can be shared with resolution agencies.'}
              </Text>
            </Pressable>
            {errors.consent && (
              <Text style={[styles.errorText, { marginTop: 4 }]}>{errors.consent}</Text>
            )}
          </View>
        )}

        {/* ================= STEP 6: REVIEW & SUBMIT ================= */}
        {currentStep === 6 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {language === 'hi' ? 'अपनी रिपोर्ट की समीक्षा करें' : 'Review your report'}
            </Text>
            <Text style={styles.stepSubtext}>
              {language === 'hi'
                ? 'सबमिट करने से पहले विवरण जांच लें। किसी भी खंड को बदलने के लिए ‘संपादित करें’ दबाएं।'
                : 'Double-check all details. Tap "Edit" on any section to modify.'}
            </Text>

            {/* Summary Card */}
            <View style={[styles.reviewCard, Shadows.sm]}>
              {/* Section 1: Title & Description */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {language === 'hi' ? '1. समस्या विवरण' : '1. Problem Description'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit problem description"
                    onPress={() => setCurrentStep(1)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {language === 'hi' ? 'बदलें' : 'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueTitle}>{title}</Text>
                <Text style={styles.reviewValueDesc}>{description}</Text>
              </View>

              {/* Section 2: Category */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {language === 'hi' ? '2. श्रेणी' : '2. Category'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit category"
                    onPress={() => setCurrentStep(2)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {language === 'hi' ? 'बदलें' : 'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueTitle}>
                  {CIVIC_CATEGORIES.find((c) => c.id === categoryId)?.nameEn}
                </Text>
              </View>

              {/* Section 3: Evidence */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {language === 'hi' ? '3. साक्ष्य (Evidence)' : '3. Evidence Attached'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit attached evidence"
                    onPress={() => setCurrentStep(3)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {language === 'hi' ? 'बदलें' : 'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueDesc}>
                  {mediaList.length > 0
                    ? `${mediaList.length} ${
                        language === 'hi'
                          ? 'फ़ाइलें संकुचित व संलग्न हैं'
                          : 'optimized media files attached'
                      }`
                    : language === 'hi'
                    ? 'कोई मीडिया संलग्न नहीं (छोड़ा गया)'
                    : 'No media attached (Skipped)'}
                </Text>
              </View>

              {/* Section 4: Location */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {language === 'hi' ? '4. स्थान' : '4. Location'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit location"
                    onPress={() => setCurrentStep(4)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {language === 'hi' ? 'बदलें' : 'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueTitle}>
                  {location.villageOrWard}, {location.block}, {location.district}
                </Text>
                <Text style={styles.reviewValueDesc}>
                  {location.address || 'Standard GPS verified pinpoint'}
                </Text>
              </View>

              {/* Section 5: Urgency & Impact */}
              <View style={[styles.reviewSection, { borderBottomWidth: 0 }]}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {language === 'hi' ? '5. गंभीरता एवं प्रभाव' : '5. Urgency & Impact'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit urgency and impact"
                    onPress={() => setCurrentStep(5)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {language === 'hi' ? 'बदलें' : 'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueDesc}>
                  • {language === 'hi' ? 'गंभीरता स्तर: ' : 'Urgency: '}
                  <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                    {urgency}
                  </Text>
                </Text>
                <Text style={styles.reviewValueDesc}>
                  • {language === 'hi' ? 'प्रभावित लोग: ' : 'Affected: '}{' '}
                  {affectedCount}+ citizens ({affectedGroups.join(', ')})
                </Text>
                <Text style={styles.reviewValueDesc}>
                  • {language === 'hi' ? 'गुमनाम प्रविष्टि: ' : 'Anonymous: '}{' '}
                  {isAnonymous ? (language === 'hi' ? 'हाँ' : 'Yes') : (language === 'hi' ? 'नहीं' : 'No')}
                </Text>
              </View>
            </View>

            {/* Official Review Notice */}
            <View style={styles.officialNotice}>
              <ShieldCheck size={18} color="#16A34A" />
              <Text style={styles.officialNoticeText}>
                {language === 'hi'
                  ? 'आपकी रिपोर्ट संबंधित सरकारी विभागों और समाधान भागीदारों के साथ साझा करने से पहले समन्वयकों द्वारा जांची जाएगी।'
                  : 'Your report will be reviewed by local coordinators before it is shared with relevant organizations.'}
              </Text>
            </View>
          </View>
        )}

        {/* Action Controls (Back, Continue, Submit) */}
        <View style={styles.wizardFooter}>
          {currentStep < 6 ? (
            <View style={styles.wizardNavRow}>
              <Button
                title={language === 'hi' ? 'पीछे' : 'Back'}
                onPress={handleBack}
                variant="outline"
                size="lg"
                style={styles.halfBtn}
              />
              <Button
                title={language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
                onPress={handleNext}
                variant="action"
                size="lg"
                style={styles.halfBtn}
              />
            </View>
          ) : (
            <View style={styles.submitColumn}>
              <Button
                title={language === 'hi' ? 'रिपोर्ट सबमिट करें' : 'Submit Report'}
                onPress={handleSubmit}
                variant="action"
                size="lg"
                icon={<Check size={20} color="#FFFFFF" strokeWidth={3} />}
                style={styles.fullBtn}
              />
              <Button
                title={language === 'hi' ? 'ड्राफ्ट के रूप में सहेजें' : 'Save as Draft'}
                onPress={handleSaveDraft}
                variant="outline"
                size="md"
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: SamadhanColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  navIconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarCenter: {
    alignItems: 'center',
  },
  wizardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  stepCounter: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primarySurface,
    minHeight: 36,
  },
  saveDraftText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#E2E8F0',
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: '#FFFFFF',
  },
  progressSegmentActive: {
    backgroundColor: SamadhanColors.action,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  stepContainer: {
    marginBottom: Spacing.xl,
  },
  stepHeading: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    lineHeight: 24,
  },
  stepSubtext: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: SamadhanColors.textPrimary,
    minHeight: 48,
  },
  textArea: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: SamadhanColors.textPrimary,
    minHeight: 110,
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  fieldMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  charCount: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
  },
  suggestionsContainer: {
    marginTop: Spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
    marginBottom: 6,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  suggestionChipText: {
    fontSize: 11,
    color: SamadhanColors.textPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
    paddingVertical: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1.5,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    position: 'relative',
    minHeight: 125,
  },
  categoryCardSelected: {
    backgroundColor: '#FAF5FF',
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  categoryDesc: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    marginTop: 2,
    lineHeight: 13,
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 8,
  },
  urgencyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  urgencyPillActive: {},
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  urgencyTextActive: {
    color: '#FFFFFF',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 42,
  },
  checkboxItemActive: {
    borderColor: SamadhanColors.primary,
    backgroundColor: SamadhanColors.primarySurface,
  },
  checkSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkSquareActive: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textPrimary,
  },
  checkboxLabelActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  toggleDesc: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
    paddingRight: 8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  consentText: {
    flex: 1,
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 17,
  },
  reviewCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  reviewSection: {
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reviewSecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewSecTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  reviewValueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 2,
  },
  reviewValueDesc: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 17,
  },
  officialNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  officialNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
    lineHeight: 16,
    fontWeight: '500',
  },
  wizardFooter: {
    marginTop: Spacing.md,
  },
  wizardNavRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfBtn: {
    flex: 1,
  },
  submitColumn: {
    width: '100%',
  },
  fullBtn: {
    width: '100%',
  },
});
