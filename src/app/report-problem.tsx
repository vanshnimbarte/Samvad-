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


  const [currentStep, setCurrentStep] = useState<number>(1);


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


  const [errors, setErrors] = useState<Record<string, string>>({});


  const suggestedTitles = [
    'Broken handpump near the primary school',
    'Flooded village road during monsoon',
    'Missing streetlights near health center',
    'Irregular garbage dumping in residential area',
  ];


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


  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim() || title.trim().length < 5) {
        newErrors.title =
          'Please enter a title of at least 5 characters.';
      }
      if (!description.trim() || description.trim().length < 15) {
        newErrors.description =
          'Please describe the problem in more detail (min 15 chars).';
      }
    }

    if (step === 2) {
      if (!categoryId) {
        newErrors.category =
          'Please select a category.';
      }
    }

    if (step === 5) {
      if (!consentGiven) {
        newErrors.consent =
          'Please confirm that the information provided is accurate.';
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
          'Please confirm that the information provided is accurate.',
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
    'Describe',
    'Category',
    'Evidence',
    'Location',
    'Details',
    'Review',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      
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
            {'Report a Problem'}
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
            {'Draft'}
          </Text>
        </Pressable>
      </View>

      
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
        
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'What problem did you notice?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Explain what is happening, where it is happening, and who is affected.'}
            </Text>

            
            <Pressable
              onPress={() => {
                setTitle('Broken handpump near Ormanjhi Primary School');
                setDescription('The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks. Over 200 students and villagers are affected.');
                setCategoryId('water');
                setUrgency('high');
                setAffectedCount('220');
                showToast('Demo grievance details autofilled!', 'info');
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
                {'✨ Autofill Demo Grievance'}
              </Text>
            </Pressable>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {'Problem Title'} *
              </Text>
              <TextInput
                accessibilityLabel="Problem Title Input"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder={
                  'e.g., Broken handpump near the primary school'
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
                    {'Give a clear, specific title'}
                  </Text>
                )}
                <Text style={styles.charCount}>{title.length}/90</Text>
              </View>

              
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionHeader}>
                  <Sparkles size={12} color={SamadhanColors.primary} />{' '}
                  {'Suggested titles:'}
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

            
            <VoiceInputButton
              onTranscriptionAvailable={(text) => {
                setDescription((prev) => (prev ? `${prev} ${text}` : text));
              }}
            />

            
            <View style={[styles.inputGroup, { marginTop: Spacing.md }]}>
              <Text style={styles.label}>
                {'Problem Description'} *
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
                  'Explain what is happening, how long it has been broken, and how community members are affected...'
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
                    {'Minimum 15 characters required'}
                  </Text>
                )}
                <Text style={styles.charCount}>{description.length}/500</Text>
              </View>
            </View>
          </View>
        )}

        
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'What type of problem is this?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Selecting the right category routes your issue to the correct line department.'}
            </Text>

            
            <View style={styles.searchBox}>
              <Search size={18} color={SamadhanColors.textMuted} />
              <TextInput
                accessibilityLabel="Search categories"
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholder={
                  'Search categories (e.g., water, road, school)...'
                }
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.searchInput}
              />
            </View>

            
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

        
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'Can you share any evidence?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Evidence accelerates validation. Images are auto-compressed for low networks.'}
            </Text>

            <MediaUploader
              mediaList={mediaList}
              onChange={setMediaList}
              onSkip={() => setCurrentStep(4)}
            />
          </View>
        )}

        
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'Where is the problem?'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Provide exact GPS coordinates or select your district, block, and ward.'}
            </Text>

            <LocationPicker value={location} onChange={setLocation} />
          </View>
        )}

        
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'Help us understand the impact'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Urgency and affected citizen counts help prioritize resources on the ground.'}
            </Text>

            
            <Text style={styles.fieldLabel}>
              {'How urgent is this problem?'} *
            </Text>
            <View style={styles.urgencyGrid}>
              {[
                { key: 'low', labelEn: 'Low', labelHi: 'Low', color: '#0284C7' },
                { key: 'medium', labelEn: 'Medium', labelHi: 'Medium', color: '#D97706' },
                { key: 'high', labelEn: 'High', labelHi: 'High', color: '#EA580C' },
                { key: 'emergency', labelEn: 'Emergency', labelHi: 'Emergency', color: '#DC2626' },
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

            
            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={styles.fieldLabel}>
                {'How many people are affected?'}
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

            
            <View style={[styles.inputGroup, { marginTop: Spacing.md }]}>
              <Text style={styles.fieldLabel}>
                {'Who is affected?'}
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

            
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  {'Is this a recurring problem?'}
                </Text>
                <Text style={styles.toggleDesc}>
                  {'Happens every monsoon, seasonal, or persists after temporary fixes'}
                </Text>
              </View>
              <Switch
                value={recurring}
                onValueChange={setRecurring}
                trackColor={{ false: '#CBD5E1', true: SamadhanColors.primary }}
              />
            </View>

            
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>
                  {'Submit Anonymously'}
                </Text>
                <Text style={styles.toggleDesc}>
                  {'Your name will not be shown publicly on community boards.'}
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#CBD5E1', true: SamadhanColors.action }}
              />
            </View>

            
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
                {'I confirm that the details provided are accurate and can be shared with resolution agencies.'}
              </Text>
            </Pressable>
            {errors.consent && (
              <Text style={[styles.errorText, { marginTop: 4 }]}>{errors.consent}</Text>
            )}
          </View>
        )}

        
        {currentStep === 6 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepHeading, { fontSize: 18 * fontScale }]}>
              {'Review your report'}
            </Text>
            <Text style={styles.stepSubtext}>
              {'Double-check all details. Tap "Edit" on any section to modify.'}
            </Text>

            
            <View style={[styles.reviewCard, Shadows.sm]}>
              
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {'1. Problem Description'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit problem description"
                    onPress={() => setCurrentStep(1)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueTitle}>{title}</Text>
                <Text style={styles.reviewValueDesc}>{description}</Text>
              </View>

              
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {'2. Category'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit category"
                    onPress={() => setCurrentStep(2)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueTitle}>
                  {CIVIC_CATEGORIES.find((c) => c.id === categoryId)?.nameEn}
                </Text>
              </View>

              
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {'3. Evidence Attached'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit attached evidence"
                    onPress={() => setCurrentStep(3)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueDesc}>
                  {mediaList.length > 0
                    ? `${mediaList.length} ${
                        'optimized media files attached'
                      }`
                    : 'No media attached (Skipped)'}
                </Text>
              </View>

              
              <View style={styles.reviewSection}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {'4. Location'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit location"
                    onPress={() => setCurrentStep(4)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {'Edit'}
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

              
              <View style={[styles.reviewSection, { borderBottomWidth: 0 }]}>
                <View style={styles.reviewSecHeader}>
                  <Text style={styles.reviewSecTitle}>
                    {'5. Urgency & Impact'}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit urgency and impact"
                    onPress={() => setCurrentStep(5)}
                    style={styles.editBtn}>
                    <Edit3 size={14} color={SamadhanColors.primary} />
                    <Text style={styles.editBtnText}>
                      {'Edit'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewValueDesc}>
                  • {'Urgency: '}
                  <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                    {urgency}
                  </Text>
                </Text>
                <Text style={styles.reviewValueDesc}>
                  • {'Affected: '}{' '}
                  {affectedCount}+ citizens ({affectedGroups.join(', ')})
                </Text>
                <Text style={styles.reviewValueDesc}>
                  • {'Anonymous: '}{' '}
                  {isAnonymous ? ('Yes') : ('No')}
                </Text>
              </View>
            </View>

            
            <View style={styles.officialNotice}>
              <ShieldCheck size={18} color="#16A34A" />
              <Text style={styles.officialNoticeText}>
                {'Your report will be reviewed by local coordinators before it is shared with relevant organizations.'}
              </Text>
            </View>
          </View>
        )}

        
        <View style={styles.wizardFooter}>
          {currentStep < 6 ? (
            <View style={styles.wizardNavRow}>
              <Button
                title={'Back'}
                onPress={handleBack}
                variant="outline"
                size="lg"
                style={styles.halfBtn}
              />
              <Button
                title={'Continue'}
                onPress={handleNext}
                variant="action"
                size="lg"
                style={styles.halfBtn}
              />
            </View>
          ) : (
            <View style={styles.submitColumn}>
              <Button
                title={'Submit Report'}
                onPress={handleSubmit}
                variant="action"
                size="lg"
                icon={<Check size={20} color="#FFFFFF" strokeWidth={3} />}
                style={styles.fullBtn}
              />
              <Button
                title={'Save as Draft'}
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
