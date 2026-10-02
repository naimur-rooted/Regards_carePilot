'use client';

import { useState } from 'react';
import { DoctorBookingModal } from './doctor-booking-modal';
import type { DoctorView } from '@/lib/types';

export function DoctorBookingButton({
  doctor,
  label,
  className = 'btn-primary mt-6 w-full justify-center',
}: {
  doctor: DoctorView;
  label: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {label}
      </button>
      <DoctorBookingModal
        doctor={doctor}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
