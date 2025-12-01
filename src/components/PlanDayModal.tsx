import React, { useState, useEffect } from 'react';

interface Task {
  text: string;
  span: number;
}

interface Template {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
}

interface PlanDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tasks: Task[]) => void;
}

const PlanDayModal: React.FC<PlanDayModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template: Template) => {
    onSelect(template.tasks);
    onClose();
  };

  const handleStartFresh = () => {
    const emptyTasks = Array(19).fill(null).map(() => ({ text: '', span: 1 }));
    onSelect(emptyTasks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Plan Your Day</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading templates...</div>
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={handleStartFresh}
                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              >
                Start Fresh (Empty Day)
              </button>
            </div>

            {templates.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Load from Template:</h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template)}
                      className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-left rounded-lg border border-blue-200 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{template.name}</div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {templates.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No templates saved yet. Start fresh and save your first template!
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDayModal;
