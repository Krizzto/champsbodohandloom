import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { WeaverProfile } from '../../types';

interface DeleteWeaverModalProps {
  isOpen: boolean;
  weaver: WeaverProfile | null;
  onClose: () => void;
  onConfirm: () => void;
  canDelete: boolean;
}

export const DeleteWeaverModal: React.FC<DeleteWeaverModalProps> = ({
  isOpen,
  weaver,
  onClose,
  onConfirm,
  canDelete,
}) => {
  if (!isOpen || !weaver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-stone-300 rounded-2xl shadow-2xl p-6 space-y-4">
        
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold font-editorial text-stone-900">
            Delete Master Weaver Profile?
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Are you sure you want to remove <strong className="text-stone-900">{weaver.name}</strong> from the living oral heritage carousel?
          </p>
        </div>

        {!canDelete ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <p className="font-semibold">Cannot delete this profile.</p>
            <p className="mt-0.5 text-stone-600">
              The archive requires at least one master weaver profile to be present. Add another weaver before removing this one.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
            <p>
              <strong>Location:</strong> {weaver.location}
            </p>
            <p>
              <strong>Experience:</strong> {weaver.experience}
            </p>
            <p className="text-rose-700 font-medium mt-1">
              This action cannot be undone.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Profile</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
