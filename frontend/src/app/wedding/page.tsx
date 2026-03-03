'use client';

import { useState, useRef } from 'react';
import {
  WeddingHeader,
  MessageSection,
  InformationSection,
  RSVPSection,
  SubmissionConfirmationModal,
  SubmissionSuccessModal,
  WeddingFooter,
  TermsModal,
} from '@/feature/wedding/components';
import { RSVPFormData } from '@/feature/wedding/types';
import { sampleWeddingConfig } from '@/feature/wedding/sampleData';

export default function WeddingInvitationPage() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState<RSVPFormData | null>(null);
  const rsvpSectionRef = useRef<HTMLDivElement>(null);

  const config = sampleWeddingConfig;

  const handleRSVPSubmit = (data: RSVPFormData) => {
    setFormData(data);
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = () => {
    // ここで実際のAPI呼び出しを行う
    console.log('Form submitted:', formData);
    setShowConfirmationModal(false);
    setShowSuccessModal(true);

    // 3秒後に成功モーダルを自動的に閉じる
    setTimeout(() => {
      setShowSuccessModal(false);
      setFormData(null);
      // ページをリセット
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setFormData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <WeddingHeader
        groomName={`${config.groom.romanFirstName} ${config.groom.romanLastName}`}
        brideName={`${config.bride.romanFirstName} ${config.bride.romanLastName}`}
        date={config.ceremony.date}
        venue={config.ceremony.venue.name}
        backgroundImages={[
          "/img/UniversalStudioJp.JPG",
          "/img/sample.png",
        ]}
      />

      {/* Information Section */}
      <InformationSection
        ceremony={config.ceremony}
        reception={config.reception}
      />

      {/* Message Section */}
      <MessageSection
        groom={config.groom}
        bride={config.bride}
        greetingMessage={config.greetingMessage}
      />

      {/* RSVP Section */}
      <div ref={rsvpSectionRef}>
        <RSVPSection
          deadline={config.rsvpDeadline}
          onSubmit={handleRSVPSubmit}
          onOpenTerms={() => setShowTermsModal(true)}
        />
      </div>

      {/* Footer */}
      <WeddingFooter onOpenTerms={() => setShowTermsModal(true)} />

      {/* Modals */}
      <SubmissionConfirmationModal
        isOpen={showConfirmationModal}
        data={formData}
        onConfirm={handleConfirmSubmission}
        onClose={handleCloseConfirmation}
      />

      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        guestName={
          formData
            ? `${formData.japaneseLastName} ${formData.japaneseFirstName}`
            : ''
        }
        onClose={handleCloseSuccess}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
