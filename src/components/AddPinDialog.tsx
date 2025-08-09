'use client';

import { useState, useRef, useEffect } from 'react';

interface AddPinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; assignees: string[]; targetFamilies: string[] }) => void;
  editMode?: boolean;
  initialData?: {
    title: string;
    assignees: string[];
    targetFamilies: string[];
  };
}

export default function AddPinDialog({ isOpen, onClose, onSubmit, editMode = false, initialData }: AddPinDialogProps) {
  const [title, setTitle] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [targetFamilies, setTargetFamilies] = useState<string[]>([]);
  const [familyInput, setFamilyInput] = useState('');
  const assigneeInputRef = useRef<HTMLInputElement>(null);
  const familyInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with initial data when in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setTitle(initialData.title);
      setAssignees(initialData.assignees);
      setTargetFamilies(initialData.targetFamilies);
    }
  }, [editMode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      assignees,
      targetFamilies,
    });

    // Reset form
    setTitle('');
    setAssignees([]);
    setAssigneeInput('');
    setTargetFamilies([]);
    setFamilyInput('');
  };

  const handleCancel = () => {
    setTitle('');
    setAssignees([]);
    setAssigneeInput('');
    setTargetFamilies([]);
    setFamilyInput('');
    onClose();
  };

  const handleAssigneeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = assigneeInput.trim();
      if (value && !assignees.includes(value)) {
        setAssignees([...assignees, value]);
        setAssigneeInput('');
      }
    } else if (e.key === 'Backspace' && assigneeInput === '' && assignees.length > 0) {
      setAssignees(assignees.slice(0, -1));
    }
  };

  const removeAssignee = (index: number) => {
    setAssignees(assignees.filter((_, i) => i !== index));
  };

  const handleFamilyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = familyInput.trim();
      if (value && !targetFamilies.includes(value)) {
        setTargetFamilies([...targetFamilies, value]);
        setFamilyInput('');
      }
    } else if (e.key === 'Backspace' && familyInput === '' && targetFamilies.length > 0) {
      setTargetFamilies(targetFamilies.slice(0, -1));
    }
  };

  const removeFamily = (index: number) => {
    setTargetFamilies(targetFamilies.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-semibold text-gray-900">{editMode ? 'Edit Location' : 'Add New Location'}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Location Name *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter location name"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="assignees" className="block text-sm font-medium text-gray-700 mb-2">
              Assignees
            </label>
            <div className="border border-gray-300 rounded-md p-2 min-h-[40px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="flex flex-wrap gap-2 mb-2">
                {assignees.map((assignee, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {assignee}
                    <button
                      type="button"
                      onClick={() => removeAssignee(index)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                ref={assigneeInputRef}
                type="text"
                value={assigneeInput}
                onChange={(e) => setAssigneeInput(e.target.value)}
                onKeyDown={handleAssigneeKeyDown}
                className="w-full border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
                placeholder={assignees.length === 0 ? "Enter assignees (press Enter or comma to add)" : "Add more assignees..."}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or comma to add assignees
            </p>
          </div>

          <div>
            <label htmlFor="targetFamilies" className="block text-sm font-medium text-gray-700 mb-2">
              Target Families
            </label>
            <div className="border border-gray-300 rounded-md p-2 min-h-[40px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="flex flex-wrap gap-2 mb-2">
                {targetFamilies.map((family, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {family}
                    <button
                      type="button"
                      onClick={() => removeFamily(index)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                ref={familyInputRef}
                type="text"
                value={familyInput}
                onChange={(e) => setFamilyInput(e.target.value)}
                onKeyDown={handleFamilyKeyDown}
                className="w-full border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
                placeholder={targetFamilies.length === 0 ? "Enter target families (press Enter or comma to add)" : "Add more families..."}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or comma to add families
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
                         <button
               type="submit"
               disabled={!title.trim()}
               className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {editMode ? 'Save Changes' : 'Add Location'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
