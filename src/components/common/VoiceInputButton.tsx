import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  CheckCircle,
} from 'lucide-react-native';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

interface VoiceInputButtonProps {
  onTranscriptionAvailable: (text: string) => void;
  initialAudioDuration?: number;
}

export function VoiceInputButton({ onTranscriptionAvailable }: VoiceInputButtonProps) {
  const { language, fontScale } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playSeconds, setPlaySeconds] = useState(0);


  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);


  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaySeconds((s) => {
          if (s >= recordSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, recordSeconds]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setHasRecording(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    setPlaySeconds(0);

    const sampleVoiceTranscription =
      'The handpump in front of our village primary school has been broken for 15 days. Sand and dirty water are coming out, and students must walk far for drinking water.';

    onTranscriptionAvailable(sampleVoiceTranscription);
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setHasRecording(false);
    setIsPlaying(false);
    setRecordSeconds(0);
    setPlaySeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <View style={styles.container}>
      {!hasRecording && !isRecording && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Record problem using voice"
          onPress={handleStartRecording}
          style={({ pressed }) => [
            styles.voiceCta,
            pressed && styles.buttonPressed,
          ]}>
          <View style={styles.micCircle}>
            <Mic size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ctaTitle, { fontSize: 13 * fontScale }]}>
              Speak to Describe (Voice Input)
            </Text>
            <Text style={styles.ctaSubtitle}>
              Tap to record your issue in English
            </Text>
          </View>
        </Pressable>
      )}

      {isRecording && (
        <View style={styles.recordingCard}>
          <View style={styles.recordPulse}>
            <View style={styles.redDot} />
            <Text style={styles.recordingTimer}>{formatTime(recordSeconds)}</Text>
          </View>

          <View style={styles.soundWaveRow}>
            {[8, 16, 24, 12, 28, 18, 10, 22, 14, 26, 16, 8].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: h + ((recordSeconds + i) % 4) * 4 },
                ]}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Stop voice recording"
            onPress={handleStopRecording}
            style={styles.stopButton}>
            <Square size={16} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.stopText}>
              Stop
            </Text>
          </Pressable>
        </View>
      )}

      {hasRecording && (
        <View style={styles.recordedCard}>
          <View style={styles.recordedTop}>
            <View style={styles.voiceSuccessRow}>
              <CheckCircle size={16} color={SamadhanColors.secondary} />
              <Text style={styles.voiceRecordedLabel}>
                Voice Recorded ({formatTime(recordSeconds)})
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete voice recording"
              onPress={handleDeleteRecording}
              style={styles.deleteButton}>
              <Trash2 size={16} color="#DC2626" />
            </Pressable>
          </View>

          <View style={styles.playerBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play recording'}
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.playButton}>
              {isPlaying ? (
                <Pause size={16} color="#FFFFFF" />
              ) : (
                <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </Pressable>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      recordSeconds > 0 ? (playSeconds / recordSeconds) * 100 : 0
                    }%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.playbackTimer}>
              {formatTime(isPlaying ? playSeconds : recordSeconds)}
            </Text>
          </View>

          <Text style={styles.transcriptionNotice}>
            ✓ Voice transcription has been automatically populated in the description.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  voiceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: SamadhanColors.primarySurface,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    minHeight: 52,
  },
  micCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.action,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  ctaSubtitle: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  recordingCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  recordPulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
  },
  recordingTimer: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  soundWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 30,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  stopText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  recordedCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  recordedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voiceRecordedLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.secondaryDark,
  },
  deleteButton: {
    padding: 6,
  },
  playerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#CCFBF1',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SamadhanColors.secondary,
  },
  playbackTimer: {
    fontSize: 12,
    color: SamadhanColors.secondaryDark,
    fontWeight: '600',
    minWidth: 32,
  },
  transcriptionNotice: {
    fontSize: 11,
    color: SamadhanColors.secondaryDark,
    marginTop: 6,
    fontWeight: '500',
  },
});
