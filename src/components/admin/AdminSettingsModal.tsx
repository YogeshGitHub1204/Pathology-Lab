import React, { useState } from 'react';
import { X, Lock, Building2, Check, AlertCircle } from 'lucide-react';
import { LabConfig } from '../../types/index.js';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LabConfig;
  onConfigUpdated: (newConfig: LabConfig) => void;
  authToken: string;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  authToken
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'lab'>('password');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  // Lab Config state
  const [phone, setPhone] = useState(config.lab_phone || '+91 98220 12345');
  const [address, setAddress] = useState(config.lab_address || 'Shop 12-14, Ground Floor, Fortune Business Centre, FC Road, Shivaji Nagar, Pune, Maharashtra 411005');
  const [timings, setTimings] = useState(config.lab_timings || 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM');
  const [feeNotice, setFeeNotice] = useState(config.fee_notice || 'The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.');
  const [configSuccess, setConfigSuccess] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }

    setIsSubmittingPass(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPassSuccess('Admin password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(data.error || 'Failed to change password');
      }
    } catch {
      setPassError('Server connection error');
    } finally {
      setIsSubmittingPass(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSuccess('');
    setIsSavingConfig(true);

    try {
      const pairs = [
        { key: 'lab_phone', value: phone },
        { key: 'lab_phone_raw', value: phone.replace(/[^0-9+]/g, '') },
        { key: 'lab_address', value: address },
        { key: 'lab_timings', value: timings },
        { key: 'fee_notice', value: feeNotice }
      ];

      for (const p of pairs) {
        await fetch('/api/admin/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(p)
        });
      }

      const updated = {
        ...config,
        lab_phone: phone,
        lab_phone_raw: phone.replace(/[^0-9+]/g, ''),
        lab_address: address,
        lab_timings: timings,
        fee_notice: feeNotice
      };
      onConfigUpdated(updated);
      setConfigSuccess('Laboratory configuration saved successfully!');
    } catch {
      alert('Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">Admin Settings & Configuration</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Change Admin Password
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'lab'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Lab Details & Fees
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Update the password for admin account <strong className="text-slate-900">yogeshlonare186@gmail.com</strong>.
              </p>

              {passError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="Enter current password (default: JeevanAdmin@2026)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="Enter secure new password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="Re-type new password"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPass}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm"
                >
                  {isSubmittingPass ? 'Updating...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'lab' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <p className="text-xs text-slate-600">
                Update lab contact details and timings displayed on the public landing page.
              </p>

              {configSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{configSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pune Lab Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Pune Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lab Operational Timings
                </label>
                <input
                  type="text"
                  required
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Official Course Fees Notice
                </label>
                <textarea
                  rows={2}
                  required
                  value={feeNotice}
                  onChange={(e) => setFeeNotice(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm"
                >
                  {isSavingConfig ? 'Saving...' : 'Save Lab Details'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
